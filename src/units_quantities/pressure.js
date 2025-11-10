export const pressure = {

    "psig": {multiplier: 1, shift: 0, name: "psig"},
    "psia": {multiplier: 1, shift: 14.696, name: "psia"},
    "BARa": {multiplier: 0.06894757, shift: 14.696, name: "BARa"},
    "KPa a": {multiplier: 6.894757, shift: 14.696, name: "KPa a"},
    "KPa g": {multiplier: 6.894757, shift: 0, name: "KPa g"},
    "BARg": {multiplier: 0.06894757, shift: 0, name: "BARa"},
    "Kg/cm2 a": {multiplier: 0.07031, shift: 14.696, name: "Kg/cm2 a"},
    "Kg/cm2 g": {multiplier: 0.07031, shift: 0, name: "Kg/cm2 g"},
    "atm a": {multiplier: 0.068046, shift: 14.696, name: "atm a"},
    
    convertToBase: (fromUnit, userValue) => {

        const baseUnitValue = (userValue / fromUnit.multiplier) - fromUnit.shift;
        return baseUnitValue;
    },
    
    convertFromBase: (toUnit , baseUnitValue) => {
        const convertedValue = (baseUnitValue + toUnit.shift) * toUnit.multiplier;
        return convertedValue;
    },
    
    convert: (fromUnit, toUnit, userValue) => {

        const baseUnitValue = convertToBase(fromUnit, userValue);
        const newValue = convertFromBase(toUnit, baseUnitValue);
        return newValue;
    },
    options: [
        {
            id: 0, type: "psig", label: "psig"
        },
        {
            id: 1, type: "psia", label: "psia"
        },
        {
            id: 2, type: "BARa", label: "BARa"
        },
        {
            id: 3, type: "KPa a", label: "KPa a"
        },
        {
            id: 4, type: "KPa g", label: "KPa g"
        },
        {
            id: 5, type: "BARg", label: "BARg"
        },
        {
            id: 6, type: "Kg/cm2 a", label: "Kg/cm2 a"
        },
        {
            id: 7, type: "Kg/cm2 g", label: "Kg/cm2 g"
        },
        {
            id: 8, type: "atm a", label: "atm a"
        },
    ]
}