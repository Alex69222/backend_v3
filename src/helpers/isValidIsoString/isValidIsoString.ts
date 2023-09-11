export const isValidIsoString = (isoString: string) => {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(isoString)) return false;
    const d = new Date(isoString);
    return d instanceof Date && !isNaN(d.getTime()) && d.toISOString() === isoString;
}
