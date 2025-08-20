import { isNumeric } from "../../conversions/toNumber";

export const validateBlackOilInput = (blackOilForm) => {
    if(!isNumeric(blackOilForm.qInputs[0])) return true
    if(!isNumeric(blackOilForm.qInputs[1])) return true
    if(!isNumeric(blackOilForm.qInputs[2])) return true
    if(!isNumeric(blackOilForm.qInputs[3])) return true
    return false
}

export const validateImpurities = (ImpuritiesForm) => {
    if(!isNumeric(ImpuritiesForm.qInputs[0])) return true
    if(!isNumeric(ImpuritiesForm.qInputs[1])) return true
    if(!isNumeric(ImpuritiesForm.qInputs[2])) return true
    return false
}

export const validateTemperaturePressures = (arrayTempPressForm) => {
    let nTemp = 0;
    let nPress = 0;
    for(let j = 0; j < arrayTempPressForm.tables.length; j++){
        if(!isNumeric(arrayTempPressForm.tables[j].temperature)) break;
        nTemp++;
    }
    if(nTemp == 0) return true;
    for(let j = 0; j < arrayTempPressForm.tables.length; j++){
        if(!isNumeric(arrayTempPressForm.tables[j].pressures)) break;
        nPress++;
    }
    if(nPress === 0) return true;
    return false
}