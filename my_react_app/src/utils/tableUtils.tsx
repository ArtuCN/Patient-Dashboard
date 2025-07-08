export function renderCellValue(val: any): string {
    if (val === null || val === undefined) return "";
    if (typeof val === "object") return JSON.stringify(val);
    return String(val);
}

export function sortByKey<T>(
    array: T[],
    key: string,
    asc: boolean = true
): T[] {
    return [...array].sort((a: any, b: any) => {
        const aVal = a[key];
        const bVal = b[key];
        if (aVal < bVal) return asc ? -1 : 1;
        if (aVal > bVal) return asc ? 1 : -1;
        return 0;
    });
}
