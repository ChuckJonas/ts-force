export const chunkArray = <T>(arr: T[], size: number): T[][] => {
    let chunks = [];
    let i = 0;
    let n = arr.length;

    while (i < n) {
        let chunk = arr.slice(i, i += size);
        chunks.push(chunk);
    }
    return chunks;
};
