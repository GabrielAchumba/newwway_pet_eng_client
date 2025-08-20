
export const createEditTable = (tableHeaders, originalTable, NROWS) => {
    const array = []
    const cols = []
    let nth = originalTable.length > NROWS ? originalTable.length : NROWS
    if(nth <= 0) nth = 200

    cols.push({ name: "sn", label: "SN", field: "", align: "left", type: "" })
    for(const tableHeaderRow of tableHeaders){
        cols.push({ 
            name: tableHeaderRow.name, 
            label: tableHeaderRow.title, 
            field: tableHeaderRow.name, 
            align: "left", 
            type: "", 
            isText: true })
    }

    for(let j = 0; j < nth; j++){
        const row = {}
        row["sn"] = j+1;
        for(const col  of cols){
            if(col.name !== "sn") row[col.name] = "";
        }
        array.push({
            ...row,
        })
    }

    var table = {
        title: "",
        columns: [...cols],
        rows: [...array],
        separator: "cell",
        isImport: false,
        isExport: true,
    }

    if(originalTable.length > 0 ) {
        for(let j = 0; j < originalTable.length; j++){
            table.rows[j] = originalTable[j]
        }
    }

    return table
        
}