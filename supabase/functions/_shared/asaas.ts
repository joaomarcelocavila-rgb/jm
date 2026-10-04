// Conversa com a API do Asaas. A chave fica só nos segredos do Supabase, nunca na página.
// ASAAS_ENV = "producao" usa a API real; qualquer outro valor usa o sandbox (testes, sem dinheiro de verdade).
const BASE = Deno.env.get("ASAAS_ENV") === "producao" ? "https://api.asaas.com/v3" : "https://api-sandbox.asaas.com/v3";

export const PRECOS: Record<string, { mensal: number; anual: number; nome: string }> = {
  solo: { mensal: 79, anual: 790, nome: "Solo" },
  consultorio: { mensal: 149, anual: 1490, nome: "Consultório" },
  clinica: { mensal: 249, anual: 2490, nome: "Clínica" },
};

export async function asaas(path: string, init: { method?: string; body?: unknown } = {}) {
  const key = Deno.env.get("ASAAS_API_KEY");
  if (!key) throw new Error("ASAAS_API_KEY não configurada");
  const r = await fetch(BASE + path, {
    method: init.method || "GET",
    headers: { "Content-Type": "application/json", "User-Agent": "MaisOdonto", access_token: key },
    body: init.body ? JSON.stringify(init.body) : undefined,
  });
  const txt = await r.text();
  let data: any = null;
  try { data = txt ? JSON.parse(txt) : null } catch (_) { data = { raw: txt } }
  if (!r.ok) {
    const msg = data?.errors?.map((e: any) => e.description).join(" ") || `Asaas respondeu ${r.status}`;
    throw Object.assign(new Error(msg), { status: r.status, data });
  }
  return data;
}

// Data de hoje no horário de Brasília, no formato do Asaas (AAAA-MM-DD)
export const hojeBR = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
