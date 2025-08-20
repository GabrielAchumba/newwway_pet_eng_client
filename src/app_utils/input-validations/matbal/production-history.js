export const validateProductionHistory = (productionHistoryForm) => {
    let nProd = 0;
    for(let j = 0; j < productionHistoryForm.tables.length; j++){
        if (!productionHistoryForm.tables[j].productionDatae) break;
        nProd++;
    }

    if(nProd <= 1) return true;
    
    return false
}