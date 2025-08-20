export const isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export const toNumber = (n) => {
    const a = Number(n);
    return isNumeric(n) ? Number(n): 0
}