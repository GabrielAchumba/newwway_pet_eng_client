export const wells = Array(500).fill().map((_, idx)=> {
    return {
        label: `Well ${idx + 1}`,
        checked: false,
    }
});