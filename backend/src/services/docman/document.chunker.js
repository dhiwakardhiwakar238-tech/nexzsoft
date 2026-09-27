const chunkDocument = (text) => {

    if (!text || !text.trim()) {
        return [];
    }

    const chunkSize = Number(process.env.CHUNK_SIZE);
    const chunkOverlap = Number(process.env.CHUNK_OVERLAP);

    if (!chunkSize || chunkSize <= 0) {
        throw new Error("CHUNK_SIZE must be greater than 0");
    }

    if (chunkOverlap < 0 || chunkOverlap >= chunkSize) {
        throw new Error(
            "CHUNK_OVERLAP must be >= 0 and smaller than CHUNK_SIZE"
        );
    }

    const chunks = [];

    let start = 0;
    let chunkNumber = 0;

    while (start < text.length) {

        const end = Math.min(
            start + chunkSize,
            text.length
        );

        const chunkText = text
            .slice(start, end)
            .trim();

        if (chunkText) {
            chunks.push({
                chunkNumber,
                chunkText
            });
        }

        chunkNumber++;

        start += chunkSize - chunkOverlap;
    }

    return chunks;
};

export {
    chunkDocument
};