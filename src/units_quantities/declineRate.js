export const declineRate = {

    "1/day": {multiplier: 1, shift: 0, name: "1/day"},
    "1/month": {multiplier: 30.5, shift: 0, name: "1/month"},
    "1/year": {multiplier: 365.25, shift: 0, name: "1/year"},
    "1/sec": {multiplier: 1.157407e-005, shift: 0, name: "1/sec"},
    
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
            id: 0, type: "1/day", label: "1/day"
        },
        {
            id: 1, type: "1/month", label: "1/month"
        },
        {
            id: 2, type: "1/year", label: "1/year"
        },
        {
            id: 3, type: "1/sec", label: "1/sec"
        },
    ]
}