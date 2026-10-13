-- Relatório MaisOdonto (somente leitura). Troque a lista de e-mails ignorados em "ignorar".
with ignorar(email) as (values ('seu-email@exemplo.com')),
u as (
  select u.id, u.email, u.created_at, u.last_sign_in_at,
         coalesce(nullif(u.raw_user_meta_data->>'name',''), split_part(u.email,'@',1)) as nome,
         nullif(u.raw_user_meta_data->>'whatsapp','') as whatsapp,
         coalesce(c.plano, u.raw_user_meta_data->>'plano') as plano,
         coalesce(case jsonb_typeof(c.dados->'cli') when 'array' then jsonb_array_length(c.dados->'cli')
                    when 'object' then (select count(*) from jsonb_object_keys(c.dados->'cli')) end, 0) as pacientes,
         coalesce(case jsonb_typeof(c.dados->'ap') when 'array' then jsonb_array_length(c.dados->'ap')
                    when 'object' then (select count(*) from jsonb_object_keys(c.dados->'ap')) end, 0) as agendamentos
  from auth.users u
  left join public.contas c on c.user_id = u.id
  where lower(u.email) not in (select lower(email) from ignorar)
),
pagas as (
  select a.*, uu.email, coalesce(nullif(uu.raw_user_meta_data->>'name',''), uu.email) as nome,
         case when a.ciclo = 'anual' then a.valor / 12 else a.valor end as mrr
  from public.assinaturas a
  join auth.users uu on uu.id = a.user_id
  where a.status = 'ativa' and a.valor > 0 and a.id not like 'cortesia\_%'
    and lower(uu.email) not in (select lower(email) from ignorar)
)
select json_build_object(
  'gerado_em', now(),
  'novas_24h', coalesce((select json_agg(json_build_object('nome',nome,'email',email,'whatsapp',whatsapp,'plano',plano,
        'cadastro',created_at,'paciente',pacientes>0,'consulta',agendamentos>0) order by created_at desc)
      from u where created_at >= now() - interval '24 hours'), '[]'),
  'paradas', coalesce((select json_agg(json_build_object('nome',nome,'email',email,'whatsapp',whatsapp,
        'cadastro',created_at,'dias',floor(extract(epoch from now()-created_at)/86400)::int,'ultimo_login',last_sign_in_at) order by created_at)
      from u where created_at < now() - interval '24 hours' and created_at >= now() - interval '7 days' and pacientes = 0), '[]'),
  'vendas_24h', coalesce((select json_agg(json_build_object('nome',nome,'email',email,'plano',plano,'ciclo',ciclo,'valor',valor,'criado_em',criado_em))
      from pagas where criado_em >= now() - interval '24 hours'), '[]'),
  'assinantes_pagos', (select count(distinct user_id) from pagas),
  'mrr', (select coalesce(round(sum(mrr),2),0) from pagas),
  'total_contas', (select count(*) from u)
) as relatorio;
