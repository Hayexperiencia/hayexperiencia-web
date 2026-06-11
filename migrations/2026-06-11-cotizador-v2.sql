-- Cotizador v2 — migracion aditiva (no rompe v1; rollback de codigo es seguro)
-- Aplicar ANTES de deployar el codigo v2:
--   psql -h postgres-hayexperiencia -U postgres -d postgres -f migrations/2026-06-11-cotizador-v2.sql
BEGIN;

-- Proyectos: parametros nuevos del motor v2
ALTER TABLE hei_projects
  ADD COLUMN IF NOT EXISTS cash_discount_pct numeric(5,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS appreciation_rate_annual numeric(5,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS contact_whatsapp varchar(20),
  ADD COLUMN IF NOT EXISTS advisor_name varchar(100),
  ADD COLUMN IF NOT EXISTS quote_validity_days integer NOT NULL DEFAULT 15;

-- Cotizaciones: seguimiento comercial + share + snapshot del plan
ALTER TABLE hei_quotations
  ADD COLUMN IF NOT EXISTS followup_status varchar(20) NOT NULL DEFAULT 'nueva',
  ADD COLUMN IF NOT EXISTS admin_notes text,
  ADD COLUMN IF NOT EXISTS overrides jsonb,
  ADD COLUMN IF NOT EXISTS share_token varchar(24),
  ADD COLUMN IF NOT EXISTS valid_until date,
  ADD COLUMN IF NOT EXISTS plan_snapshot jsonb;

ALTER TABLE hei_quotations DROP CONSTRAINT IF EXISTS hei_quotations_followup_check;
ALTER TABLE hei_quotations ADD CONSTRAINT hei_quotations_followup_check
  CHECK (followup_status IN ('nueva','contactado','negociacion','cerrada','descartada'));

-- Backfill share tokens para cotizaciones existentes
UPDATE hei_quotations
SET share_token = substr(replace(gen_random_uuid()::text, '-', ''), 1, 12)
WHERE share_token IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS hei_quotations_share_token_key ON hei_quotations(share_token);

-- Eventos del funnel del cotizador (tracking propio, sin PII)
CREATE TABLE IF NOT EXISTS hei_cotizador_events (
  id bigserial PRIMARY KEY,
  session_hash varchar(64),
  event varchar(40) NOT NULL,
  project_slug varchar(50),
  unit_id integer,
  quotation_code varchar(20),
  channel varchar(20) DEFAULT 'web',
  meta jsonb,
  created_at timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cotz_events_event ON hei_cotizador_events(event, created_at);
CREATE INDEX IF NOT EXISTS idx_cotz_events_created ON hei_cotizador_events(created_at);

-- ALUNA: valores que vivian hardcodeados en AlunaCotizador.tsx (5% contado, 7% valorizacion)
UPDATE hei_projects SET
  cash_discount_pct = 5.00,
  appreciation_rate_annual = 7.00
WHERE slug = 'aluna';

-- WhatsApp y asesor comercial default (Cesar) para todos los proyectos
UPDATE hei_projects SET
  contact_whatsapp = COALESCE(contact_whatsapp, '573022343659'),
  advisor_name = COALESCE(advisor_name, 'César Delgado');

COMMIT;
