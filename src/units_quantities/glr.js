export const glr = {

    "STB/MMScf": {multiplier: 1, shift: 0, name: "STB/MMScf"},
    "Sm3/Sm3": {multiplier: 5.6433e-006, shift: 0, name: "Sm3/Sm3"},
    "m3/m3": {multiplier: 5.6433e-006, shift: 0, name: "m3/m3"},
    "STB/Mscf": {multiplier: 0.001, shift: 0, name: "STB/Mscf"},
    "STB/scf": {multiplier: 0.000001, shift: 0, name: "STB/Mscf"},
    "Sm3/KSm3": {multiplier: 0.0056433, shift: 0, name: "Sm3/KSm3"},
    
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
            id: 0, type: "STB/MMScf", label: "STB/MMScf"
        },
        {
            id: 1, type: "Sm3/Sm3", label: "Sm3/Sm3"
        },
        {
            id: 2, type: "m3/m3", label: "m3/m3"
        },
        {
            id: 3, type: "STB/Mscf", label: "STB/Mscf"
        },
        {
            id: 4, type: "STB/Mscf", label: "STB/Mscf"
        },
        {
            id: 5, type: "Sm3/KSm3", label: "Sm3/KSm3"
        }
    ]
}