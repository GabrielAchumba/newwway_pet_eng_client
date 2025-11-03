export const liquidVolume = {

    "MMSTB": {multiplier: 1, shift: 0, name: "MMSTB"},
    "MSm3": {multiplier: 0.159, shift: 0, name: "MSm3"},
    "BSTB": {multiplier: 0.001, shift: 0, name: "BSTB"},
    "BSm3": {multiplier: 0.000159, shift: 0, name: "BSm3"},
    "MSTB": {multiplier: 1000, shift: 0, name: "MSTB"},
    "KSm3": {multiplier: 159, shift: 0, name: "KSm3"},
    "Mm3": {multiplier: 0.1507188, shift: 0, name: "Mm3"},
    "km3": {multiplier: 150.7188, shift: 0, name: "km3"},
    "GSm3": {multiplier: 0.000159, shift: 0, name: "GSm3"},
    "Gm3": {multiplier: 0.0001507188, shift: 0, name: "Gm3"},
    "STB": {multiplier: 1000000, shift: 0, name: "STB"},
    "Sm3": {multiplier: 159000, shift: 0, name: "Sm3"},
    "m3": {multiplier: 150718.8, shift: 0, name: "m3"},
    
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
            id: 0, type: "MMSTB", label: "MMSTB"
        },
        {
            id: 1, type: "MSm3", label: "MSm3"
        },
        {
            id: 2, type: "BSTB", label: "BSTB"
        },
        {
            id: 3, type: "BSm3", label: "BSm3"
        },
        {
            id: 4, type: "MSTB", label: "MSTB"
        },
        {
            id: 5, type: "KSm3", label: "KSm3"
        },
        {
            id: 6, type: "Mm3", label: "Mm3"
        },
        {
            id: 7, type: "km3", label: "km3"
        },
        {
            id: 8, type: "GSm3", label: "GSm3"
        },
        {
            id: 9, type: "Gm3", label: "Gm3"
        },
        {
            id: 10, type: "STB", label: "STB"
        },
        {
            id: 11, type: "Sm3", label: "Sm3"
        },
        {
            id: 12, type: "m3", label: "m3"
        },
    ]
}