// Cria (ou cancela) a assinatura da pessoa logada e devolve o link de pagamento do Asaas.
// Corpo: { plano: "solo" | "consultorio" | "clinica" | "gratis", ciclo: "mensal" | "anual", metodo: "pix" | "outro", cpfCnpj: "..." }
// Com metodo "pix" devolve também o QR Code e o Pix copia e cola para pagar dentro do app.
import { createClient } from "npm:@supabase/supabase-js@2";
import { asaas, PRECOS, hojeBR } from "../_shared/asaas.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (req.method !== "POST") return json({ erro: "Use POST." }, 405);
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    // quem está pedindo: confere o login pelo token enviado pelo app
    const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
    const { data: u, error: ue } = await admin.auth.getUser(token);
    if (ue || !u?.user) return json({ erro: "Entre na sua conta de novo." }, 401);
    const user = u.user;

    const { plano, ciclo = "mensal", cpfCnpj = "", metodo: m = "outro" } = await req.json().catch(() => ({}));
    const metodo = m === "pix" ? "pix" : "outro";

    // voltar para o Grátis: cancela as assinaturas e muda o plano
    if (plano === "gratis") {
      const { data: subs } = await admin.from("assinaturas").select("id").eq("user_id", user.id).in("status", ["aguardando", "ativa", "atrasada"]);
      for (const s of subs || []) {
        await asaas(`/subscriptions/${s.id}`, { method: "DELETE" }).catch(() => {});
        await admin.from("assinaturas").update({ status: "cancelada", atualizado_em: new Date().toISOString() }).eq("id", s.id);
      }
      await admin.from("contas").update({ plano: "gratis" }).eq("user_id", user.id);
      return json({ ok: true, plano: "gratis" });
    }

    const preco = PRECOS[plano];
    if (!preco || !["mensal", "anual"].includes(ciclo)) return json({ erro: "Plano ou ciclo inválido." }, 400);

    // cliente no Asaas (cria na primeira vez; o Asaas exige CPF ou CNPJ)
    let { data: cli } = await admin.from("pagamento_clientes").select("asaas_customer_id").eq("user_id", user.id).maybeSingle();
    if (!cli) {
      const doc = String(cpfCnpj).replace(/\D/g, "");
      if (doc.length !== 11 && doc.length !== 14) return json({ erro: "Informe um CPF ou CNPJ válido.", campo: "cpf" }, 400);
      const nome = String(user.user_metadata?.name || user.email).slice(0, 100);
      const c = await asaas("/customers", { method: "POST", body: { name: nome, email: user.email, cpfCnpj: doc, externalReference: user.id, notificationDisabled: false } });
      await admin.from("pagamento_clientes").insert({ user_id: user.id, asaas_customer_id: c.id });
      cli = { asaas_customer_id: c.id };
    }

    // QR Code Pix da primeira cobrança da assinatura (a imagem vem em base64)
    const dadosPagamento = async (subId: string) => {
      const pays = await asaas(`/subscriptions/${subId}/payments`);
      const pg = pays?.data?.[0];
      if (!pg) throw new Error("Cobrança ainda não gerada");
      const out: Record<string, unknown> = { url: pg.invoiceUrl || null };
      if (metodo === "pix") {
        const q = await asaas(`/payments/${pg.id}/pixQrCode`);
        out.pix = { imagem: q.encodedImage, copiaECola: q.payload, expira: q.expirationDate };
      }
      return out;
    };

    // reaproveita um pedido ainda não pago do mesmo plano, ciclo e método, para não gerar cobranças repetidas
    const { data: pend } = await admin.from("assinaturas").select("id").eq("user_id", user.id).eq("plano", plano).eq("ciclo", ciclo).eq("metodo", metodo).eq("status", "aguardando").maybeSingle();
    if (pend) {
      try { return json({ ok: true, ...(await dadosPagamento(pend.id)), assinatura: pend.id }); }
      catch (_) { // cobrança vencida ou removida: cancela e cria uma nova
        await asaas(`/subscriptions/${pend.id}`, { method: "DELETE" }).catch(() => {});
        await admin.from("assinaturas").update({ status: "cancelada", atualizado_em: new Date().toISOString() }).eq("id", pend.id);
      }
    }

    const valor = preco[ciclo as "mensal" | "anual"];
    const sub = await asaas("/subscriptions", {
      method: "POST",
      body: {
        customer: cli.asaas_customer_id,
        billingType: metodo === "pix" ? "PIX" : "UNDEFINED", // UNDEFINED: a pessoa escolhe cartão, boleto ou Pix na página do Asaas
        value: valor,
        nextDueDate: hojeBR(),
        cycle: ciclo === "anual" ? "YEARLY" : "MONTHLY",
        description: `MaisOdonto, plano ${preco.nome} (${ciclo})`,
        externalReference: `${user.id}|${plano}|${ciclo}`,
      },
    });
    const dados = await dadosPagamento(sub.id);
    await admin.from("assinaturas").insert({ id: sub.id, user_id: user.id, plano, ciclo, valor, metodo, status: "aguardando", link_pagamento: (dados.url as string) || null });
    return json({ ok: true, ...dados, assinatura: sub.id });
  } catch (e) {
    console.error("assinar:", e);
    const msg = (e as Error).message || "";
    const st = (e as { status?: number }).status;
    return json({ erro: /cpf|cnpj/i.test(msg) ? "O Asaas não aceitou o CPF ou CNPJ. Confira o número." : st === 401 || /ASAAS_API_KEY/.test(msg) ? "O pagamento está indisponível no momento. Avise o suporte." : "Não foi possível gerar a cobrança agora. Tente de novo em instantes." }, 502);
  }
});
