// Recebe os avisos do Asaas (pagamento confirmado, atrasado, assinatura cancelada) e atualiza o plano da conta.
// No painel do Asaas, configure o webhook com o mesmo token salvo em ASAAS_WEBHOOK_TOKEN.
import { createClient } from "npm:@supabase/supabase-js@2";
import { asaas } from "../_shared/asaas.ts";

const ok = () => new Response("ok", { status: 200 });

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Use POST", { status: 405 });
  const esperado = Deno.env.get("ASAAS_WEBHOOK_TOKEN");
  if (!esperado || req.headers.get("asaas-access-token") !== esperado) return new Response("Não autorizado", { status: 401 });

  const ev = await req.json().catch(() => null);
  if (!ev?.event) return ok();
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const agora = new Date().toISOString();
  const subId: string | undefined = ev.payment?.subscription || ev.subscription?.id;
  if (!subId) return ok(); // cobrança avulsa, não é de assinatura

  const { data: sub } = await admin.from("assinaturas").select("id, user_id, plano, status").eq("id", subId).maybeSingle();
  if (!sub) return ok(); // assinatura de fora do app

  try {
    switch (ev.event) {
      case "PAYMENT_CONFIRMED":
      case "PAYMENT_RECEIVED": {
        // pedido já encerrado (cancelado ou trocado por outro plano): não muda o plano da conta
        if (sub.status === "cancelada" || sub.status === "substituida") break;
        // pagou: esta assinatura passa a valer e as outras da pessoa são encerradas
        await admin.from("assinaturas").update({ status: "ativa", atualizado_em: agora }).eq("id", sub.id);
        await admin.from("contas").update({ plano: sub.plano }).eq("user_id", sub.user_id);
        const { data: outras } = await admin.from("assinaturas").select("id").eq("user_id", sub.user_id).neq("id", sub.id).in("status", ["aguardando", "ativa", "atrasada"]);
        for (const o of outras || []) {
          await asaas(`/subscriptions/${o.id}`, { method: "DELETE" }).catch(() => {});
          await admin.from("assinaturas").update({ status: "substituida", atualizado_em: agora }).eq("id", o.id);
        }
        break;
      }
      case "PAYMENT_OVERDUE": {
        // venceu sem pagar: volta para o Grátis até pagar (os dados continuam lá)
        if (sub.status === "ativa" || sub.status === "atrasada") {
          await admin.from("assinaturas").update({ status: "atrasada", atualizado_em: agora }).eq("id", sub.id);
          await admin.from("contas").update({ plano: "gratis" }).eq("user_id", sub.user_id);
        }
        break;
      }
      case "PAYMENT_REFUNDED":
      case "SUBSCRIPTION_DELETED":
      case "SUBSCRIPTION_INACTIVATED": {
        if (sub.status === "substituida" || sub.status === "cancelada") break;
        const eraAtiva = sub.status === "ativa" || sub.status === "atrasada";
        await admin.from("assinaturas").update({ status: "cancelada", atualizado_em: agora }).eq("id", sub.id);
        if (eraAtiva) await admin.from("contas").update({ plano: "gratis" }).eq("user_id", sub.user_id);
        break;
      }
    }
  } catch (e) {
    console.error("asaas-webhook:", ev.event, e);
    return new Response("erro", { status: 500 }); // o Asaas tenta de novo
  }
  return ok();
});
