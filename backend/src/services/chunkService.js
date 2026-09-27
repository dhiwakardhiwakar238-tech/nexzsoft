const chunkText = (text, chunkSize = 800, overlap = 150) => {

    if (!text) return [];

    const chunks = [];

    let start = 0;

    while (start < text.length) {

        const end = start + chunkSize;

        chunks.push(text.substring(start, end));

        start += (chunkSize - overlap);

    }

    return chunks.filter(c => c.trim().length > 20);

};

export default {
    chunkText
};