export const assetGroups = Array(5).fill().map((_, idx)=> {
    return {
        name: `Asset Group ${idx + 1}`,
        description: `Asset Group Desc ${idx + 1}`,
        checked: false,
    }
});