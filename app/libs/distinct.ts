export const distinct = (arr: any[], value:string) => {
    const seen = new Set<string>();
    return arr.filter((item) => {
        const key = item[value];
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}