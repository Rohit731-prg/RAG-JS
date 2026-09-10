export const textChunks = (parse) => {
    if (!parse) {
        throw new Error("No text found");
    }
    const clean_parse = String(parse).replace(/\s+/g, ' ').trim();

    const chunk_size = 300;
    const over_lap = 50;

    let start_index = 0;
    const chunks = []

    while (start_index < clean_parse.length) {
        const chunk = clean_parse.slice(start_index, start_index + chunk_size);
        chunks.push(chunk);
        start_index += chunk_size - over_lap;
    }

    return chunks
}