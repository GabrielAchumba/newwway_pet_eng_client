export const vCartTable = (tables, table) => {
    let vCat = []
    if(tables.length == 0){
        vCat = [...table]
    }else{
        vCat = [...tables]
        for(const row of table){
            vCat.push({...row})
        }
    }

    return vCat;
}