export const liquidRate = {

    "STB/day": {multiplier: 1, shift: 0, name: "STB/day"},
    "Sm3/day": {multiplier: 0.1589873, shift: 0, name: "Sm3/day"},
    "m3/day": {multiplier: 0.1589873, shift: 0, name: "m3/day"},
    "m3/hour": {multiplier: 0.006625, shift: 0, name: "m3/hour"},
    "scf/day": {multiplier: 5.615, shift: 0, name: "scf/day"},
    
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
            id: 0, type: "STB/day", label: "STB/day"
        },
        {
            id: 1, type: "Sm3/day", label: "Sm3/day"
        },
        {
            id: 2, type: "m3/day", label: "m3/day"
        },
        {
            id: 3, type: "m3/hour", label: "m3/hour"
        },
        {
            id: 4, type: "scf/day", label: "scf/day"
        },
    ]
}