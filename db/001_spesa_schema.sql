-- ═══════════════════════════════════════════════════════════════════
-- Lista Spesa — schema dedicato `spesa` sul progetto
-- gfglazxhxxplhoteaahr (gestione-conti / eu-central-1).
--
-- ⚠️ COME APPLICARLO (senza toccare le app esistenti):
--   1. Apri la Dashboard Supabase → SQL Editor → New query
--   2. Incolla questo file intero → RUN
--   3. Espone lo schema a PostgREST (una tantum, ADDITIVO) — vedi
--      blocco in fondo: via SQL OPPURE Settings → API → Exposed schemas.
--   4. Abilita Realtime sulla tabella items (vedi blocco in fondo).
--
-- Isolato in `spesa.*`: non modifica `public`, `storybook`, `soundtube`.
--
-- ⚠️ MODELLO DI SICUREZZA (nessun login):
--   L'accesso è "capability-based": il segreto è il room_id (UUID a 128
--   bit) contenuto nel link di condivisione (#r=<uuid>), mai nel repo.
--   Chi conosce la anon key pubblica MA non il room_id non trova la lista
--   tramite query normali. Non è cifratura: per uso personale a basso
--   rischio. In futuro si può aggiungere un PIN senza cambiare schema.
-- ═══════════════════════════════════════════════════════════════════

create schema if not exists spesa;

-- ── Articoli della lista ────────────────────────────────────────────
create table if not exists spesa.items (
  id         uuid        primary key default gen_random_uuid(),
  room_id    uuid        not null,
  name       text        not null,
  category   text        not null default 'Altro',
  quantity   real        not null default 1,
  unit       text        not null default '',
  checked    boolean     not null default false,
  position   int         not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists items_room_idx on spesa.items (room_id, checked, position);

-- ── Memoria delle categorizzazioni apprese ──────────────────────────
-- Se l'utente corregge la categoria di un prodotto, viene salvata qui
-- e riusata automaticamente la volta successiva.
create table if not exists spesa.catalog (
  room_id      uuid        not null,
  norm_name    text        not null,
  display_name text        not null,
  category     text        not null,
  updated_at   timestamptz not null default now(),
  primary key (room_id, norm_name)
);

-- ── Trigger updated_at ──────────────────────────────────────────────
create or replace function spesa.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists trg_items_updated_at on spesa.items;
create trigger trg_items_updated_at
  before update on spesa.items
  for each row execute function spesa.set_updated_at();

drop trigger if exists trg_catalog_updated_at on spesa.catalog;
create trigger trg_catalog_updated_at
  before update on spesa.catalog
  for each row execute function spesa.set_updated_at();

-- ── RLS + policy (accesso per anon/authenticated) ───────────────────
alter table spesa.items   enable row level security;
alter table spesa.catalog enable row level security;

drop policy if exists "items_all" on spesa.items;
create policy "items_all" on spesa.items
  for all to anon, authenticated
  using (true) with check (true);

drop policy if exists "catalog_all" on spesa.catalog;
create policy "catalog_all" on spesa.catalog
  for all to anon, authenticated
  using (true) with check (true);

-- ── Grants (PostgREST + service_role) ───────────────────────────────
grant usage on schema spesa to anon, authenticated, service_role;
grant select, insert, update, delete on spesa.items, spesa.catalog
  to anon, authenticated, service_role;

-- ═══════════════════════════════════════════════════════════════════
-- ESPONI ALLA API — SOLO PRIMA VOLTA (ADDITIVO, conserva gli altri)
-- ═══════════════════════════════════════════════════════════════════
-- Metodo A (SQL):
-- alter role authenticator set pgrst.db_schemas =
--   'public, graphql_public, storybook, soundtube, spesa';
-- notify pgrst, 'reload config';
--
-- Metodo B (UI): Dashboard → Settings → API → Exposed schemas →
--   aggiungi `spesa` (tieni gli esistenti).

-- ═══════════════════════════════════════════════════════════════════
-- ABILITA REALTIME — SOLO PRIMA VOLTA
-- ═══════════════════════════════════════════════════════════════════
-- alter publication supabase_realtime add table spesa.items;
-- (oppure Dashboard → Database → Replication → abilita spesa.items)
