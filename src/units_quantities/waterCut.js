export const waterCut = {

    "percent": {multiplier: 1, shift: 0, name: "percent"},
    "fraction": {multiplier: 0.01, shift: 0, name: "fraction"},
    
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
            id: 0, type: "percent", label: "percent"
        },
        {
            id: 1, type: "fraction", label: "fraction"
        },
    ]
}