export const chunkText = async (text) => {
    const chunk_size = 200
    const overlap = 40
    const chunks = [];
    let startIndex = 0;
    const cleantext = String(text).replace(/\s+/g, '').trim();

    while(startIndex < cleantext.length) {
        const chunk = String(cleantext).slice(startIndex, startIndex + chunk_size)
        chunks.push(chunk.trim());
        startIndex += chunk_size - overlap
    };
    return chunks
};