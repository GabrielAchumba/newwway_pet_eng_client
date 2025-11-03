export const gasVolume = {

    "MMscf": {multiplier: 1, shift: 0, name: "MMscf"},
    "MSm3": {multiplier: 0.028174, shift: 0, name: "MSm3"},
    "Bscf": {multiplier: 0.001, shift: 0, name: "Bscf"},
    "BSm3": {multiplier: 2.8174e-005, shift: 0, name: "BSm3"},
    "GSm3": {multiplier: 2.8174e-005, shift: 0, name: "GSm3"},
    "Mscf": {multiplier: 1000, shift: 0, name: "Mscf"},
    "KSm3": {multiplier: 28.17399, shift: 0, name: "KSm3"},
    "Mm3": {multiplier: 0.02670659, shift: 0, name: "Mm3"},
    "km3": {multiplier: 26.70659, shift: 0, name: "km3"},
    "Gm3": {multiplier: 2.670659e-005, shift: 0, name: "Gm3"},
    "scf": {multiplier: 1000000, shift: 0, name: "scf"},
    "Sm3": {multiplier: 28174, shift: 0, name: "Sm3"},
    "m3": {multiplier: 26706.59, shift: 0, name: "m3"},
    
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
            id: 0, type: "MMscf", label: "MMscf"
        },
        {
            id: 1, type: "MSm3", label: "MSm3"
        },
        {
            id: 2, type: "Bscf", label: "Bscf"
        },
        {
            id: 3, type: "BSm3", label: "BSm3"
        },
        {
            id: 4, type: "GSm3", label: "GSm3"
        },
        {
            id: 5, type: "Mscf", label: "Mscf"
        },
        {
            id: 6, type: "KSm3", label: "KSm3"
        },
        {
            id: 7, type: "Mm3", label: "Mm3"
        },
        {
            id: 8, type: "km3", label: "km3"
        },
        {
            id: 9, type: "Gm3", label: "Gm3"
        },
        {
            id: 10, type: "scf", label: "scf"
        },
        {
            id: 11, type: "Sm3", label: "Sm3"
        },
        {
            id: 12, type: "m3", label: "m3"
        },
    ]
}