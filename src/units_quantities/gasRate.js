export const gasRate = {

    "MMscf/day": {multiplier: 1, shift: 0, name: "MMscf/day"},
    "1000Sm3/day": {multiplier: 28.17399, shift: 0, name: "1000Sm3/day"},
    "1000m3/day": {multiplier: 28.17399, shift: 0, name: "1000m3/day"},
    "m3/hour": {multiplier: 1112.774, shift: 0, name: "m3/hour"},
    "Mscf/day": {multiplier: 1000, shift: 0, name: "Mscf/day"},
    "scf/day": {multiplier: 1000000, shift: 0, name: "scf/day"},
    "Sm3/day": {multiplier: 28173.99, shift: 0, name: "Sm3/day"},
    
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
            id: 0, type: "MMscf/day", label: "MMscf/day"
        },
        {
            id: 1, type: "1000Sm3/day", label: "1000Sm3/day"
        },
        {
            id: 2, type: "1000Sm3/day", label: "1000Sm3/day"
        },
        {
            id: 3, type: "m3/hour", label: "m3/hour"
        },
        {
            id: 4, type: "Mscf/day", label: "Mscf/day"
        },
        {
            id: 5, type: "scf/day", label: "scf/day"
        },
        {
            id: 6, type: "Sm3/day", label: "Sm3/day"
        },
    ]
}