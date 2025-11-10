export const glr = {

    "scf/STB": {multiplier: 1, shift: 0, name: "scf/STB"},
    "Sm3/Sm3": {multiplier: 0.1772, shift: 0, name: "Sm3/Sm3"},
    "m3/m3": {multiplier: 0.1772, shift: 0, name: "m3/m3"},
    "Mscf/STB": {multiplier: 0.001, shift: 0, name: "Mscf/STB"},
    "MMscf/STB": {multiplier: 0.000001, shift: 0, name: "MMscf/STB"},
    "KSm3/Sm3": {multiplier: 0.0001772, shift: 0, name: "KSm3/Sm3"},
    
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
            id: 0, type: "scf/STB", label: "scf/STB"
        },
        {
            id: 1, type: "Sm3/Sm3", label: "Sm3/Sm3"
        },
        {
            id: 2, type: "m3/m3", label: "m3/m3"
        },
        {
            id: 3, type: "Mscf/STB", label: "Mscf/STB"
        },
        {
            id: 4, type: "MMscf/STB", label: "MMscf/STB"
        },
        {
            id: 5, type: "KSm3/Sm3", label: "KSm3/Sm3"
        }
    ]
}