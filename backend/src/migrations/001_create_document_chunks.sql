CREATE TABLE IF NOT EXISTS document_chunks
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    file_name TEXT NOT NULL,

    chunk_text TEXT NOT NULL,

    chunk_index INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_document_chunks_file
ON document_chunks(file_name);

CREATE INDEX IF NOT EXISTS idx_document_chunks_created
ON document_chunks(created_at);



