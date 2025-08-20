

export const wells = Array(2000).fill().map((idx)=> {
    return {
        label: `Well ${idx}`,
        checked: false,
    }
});