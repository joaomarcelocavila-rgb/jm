// Jarvis: recebe webhooks do Asaas e grava em jarvis.vendas.
// Autenticação: header 'asaas-access-token' (configurado no painel do Asaas), comparado por hash SHA-256.
// Opcional: POST ?sync=1 (mesmo header) importa os pagamentos recebidos dos últimos 90 dias via API,
// se a variável ASAAS_API_KEY estiver definida nos secrets da função.
// Deploy com verify_jwt = false (a autenticação é o token do webhook).
import postgres from "npm:postgres@3.4.4";

// Troque pelo SHA-256 (hex) do token que você colocar no webhook do Asaas.
const TOKEN_HASH = "SHA256_DO_SEU_TOKEN_DE_WEBHOOK";
const sql = postgres(Deno.env.get("SUPABASE_DB_URL")!, { prepare: false, max: 1 });

async function sha256(s: string) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

async function salvar(p: any, evento: string) {
  if (!p?.id) return;
  await sql`
    insert into jarvis.vendas (payment_id, evento, status, valor, valor_liquido, forma, descricao, cliente, data_pagamento, bruto, atualizado_em)
    values (${p.id}, ${evento}, ${p.status ?? null}, ${p.value ?? null}, ${p.netValue ?? null}, ${p.billingType ?? null},
            ${p.description ?? null}, ${p.customer ?? null}, ${p.paymentDate ?? p.clientPaymentDate ?? p.confirmedDate ?? null},
            ${sql.json(p)}, now())
    on conflict (payment_id) do update set evento = excluded.evento, status = excluded.status, valor = excluded.valor,
      valor_liquido = excluded.valor_liquido, forma = excluded.forma, descricao = excluded.descricao,
      data_pagamento = coalesce(excluded.data_pagamento, jarvis.vendas.data_pagamento), bruto = excluded.bruto, atualizado_em = now()`;
}

Deno.serve(async (req) => {
  const tok = req.headers.get("asaas-access-token") ?? "";
  if ((await sha256(tok)) !== TOKEN_HASH) return new Response("unauthorized", { status: 401 });
  const url = new URL(req.url);

  if (url.searchParams.get("sync") === "1") {
    const key = Deno.env.get("ASAAS_API_KEY");
    if (!key) return Response.json({ error: "ASAAS_API_KEY não configurada" }, { status: 400 });
    const desde = new Date(Date.now() - 90 * 864e5).toISOString().slice(0, 10);
    let total = 0;
    for (const status of ["RECEIVED", "CONFIRMED", "RECEIVED_IN_CASH"]) {
      let offset = 0;
      while (true) {
        const r = await fetch(`https://api.asaas.com/v3/payments?status=${status}&paymentDate[ge]=${desde}&limit=100&offset=${offset}`, {
          headers: { access_token: key, "User-Agent": "jarvis" },
        });
        const j = await r.json();
        if (!r.ok) return Response.json({ error: j }, { status: 502 });
        for (const p of j.data ?? []) { await salvar(p, "SYNC"); total++; }
        if (!j.hasMore) break;
        offset += 100;
      }
    }
    return Response.json({ ok: true, importados: total });
  }

  try {
    const body = await req.json();
    if (body?.payment) await salvar(body.payment, body.event ?? "");
    return Response.json({ received: true });
  } catch (e) {
    console.error(e);
    return Response.json({ received: false }, { status: 200 });
  }
});
