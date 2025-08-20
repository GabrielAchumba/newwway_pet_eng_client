export const fields = Array(100).fill().map((_, idx)=> {
    return {
        label: `Field ${idx + 1}`,
        checked: false,
    }
});