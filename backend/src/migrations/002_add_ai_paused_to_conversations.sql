ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS ai_paused BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_conversations_ai_paused
ON conversations(ai_paused);
