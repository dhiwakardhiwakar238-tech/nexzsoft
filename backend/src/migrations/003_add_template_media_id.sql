-- Run once against the same PostgreSQL database used by the backend.
ALTER TABLE whatsapp_templates
ADD COLUMN IF NOT EXISTS media_id TEXT;

CREATE INDEX IF NOT EXISTS idx_whatsapp_templates_tenant_name
ON whatsapp_templates (tenant_id, name);
