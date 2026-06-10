-- Inbox de eventos de Plane (webhook → tabla → heartbeat Harry)
-- Ejecutar en BD hayexperiencia (Postgres 17, container Coolify).
-- Diseño: investigaciones/2026-06-10 + skills/plane/references/integration-webhook.md

CREATE TABLE IF NOT EXISTS plane_events (
  id SERIAL PRIMARY KEY,
  delivery_id TEXT UNIQUE NOT NULL,        -- header X-Plane-Delivery (dedup)
  event TEXT NOT NULL,                     -- issue | issue_comment | ...
  action TEXT,                             -- created | updated | deleted
  project TEXT,                            -- project id del payload
  workitem_id TEXT,
  workitem_name TEXT,
  actor TEXT,                              -- quien disparo el evento (para filtrar bots)
  assignees JSONB,                         -- array de assignee ids
  payload JSONB NOT NULL,                  -- payload completo de Plane
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ                 -- NULL = pendiente para heartbeat
);

CREATE INDEX IF NOT EXISTS idx_plane_events_unprocessed
  ON plane_events (created_at) WHERE processed_at IS NULL;
