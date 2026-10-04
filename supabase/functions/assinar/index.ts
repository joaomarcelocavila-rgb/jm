// Cria (ou cancela) a assinatura da pessoa logada e devolve o link de pagamento do Asaas.
// Corpo: { plano: "solo" | "consultorio" | "clinica" | "gratis", ciclo: "mensal" | "anual", cpfCnpj: "..." }
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

    const { plano, ciclo = "mensal", cpfCnpj = "" } = await req.json().catch(() => ({}));

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

    // reaproveita um pedido ainda não pago do mesmo plano e ciclo, para não gerar cobranças repetidas
    const { data: pend } = await admin.from("assinaturas").select("id, link_pagamento").eq("user_id", user.id).eq("plano", plano).eq("ciclo", ciclo).eq("status", "aguardando").maybeSingle();
    if (pend?.link_pagamento) return json({ ok: true, url: pend.link_pagamento, assinatura: pend.id });

    const valor = preco[ciclo as "mensal" | "anual"];
    const sub = await asaas("/subscriptions", {
      method: "POST",
      body: {
        customer: cli.asaas_customer_id,
        billingType: "UNDEFINED", // a pessoa escolhe Pix, boleto ou cartão na página do Asaas
        value: valor,
        nextDueDate: hojeBR(),
        cycle: ciclo === "anual" ? "YEARLY" : "MONTHLY",
        description: `MaisOdonto, plano ${preco.nome} (${ciclo})`,
        externalReference: `${user.id}|${plano}|${ciclo}`,
      },
    });
    const pays = await asaas(`/subscriptions/${sub.id}/payments`);
    const link = pays?.data?.[0]?.invoiceUrl || null;
    await admin.from("assinaturas").insert({ id: sub.id, user_id: user.id, plano, ciclo, valor, status: "aguardando", link_pagamento: link });
    return json({ ok: true, url: link, assinatura: sub.id });
  } catch (e) {
    console.error("assinar:", e);
    const msg = (e as Error).message || "";
    return json({ erro: /cpf|cnpj/i.test(msg) ? "O Asaas não aceitou o CPF ou CNPJ. Confira o número." : "Não foi possível gerar a cobrança agora. Tente de novo em instantes." }, 502);
  }
});
