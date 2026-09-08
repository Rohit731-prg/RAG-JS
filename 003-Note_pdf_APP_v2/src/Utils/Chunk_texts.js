export const chunkText = (data) => {
    const clean_text = String(data).replace(/\s+/g, '').trim();
    const chunk_size = 200
    const overlap = 40


    let start_index = 0
    const chunks = []

    while (start_index < clean_text.length) {
        const chunk = clean_text.slice(start_index, start_index + chunkText);
        chunks.push(chunk)
        start_index += chunk_size - overlap
    }

    return chunks
}