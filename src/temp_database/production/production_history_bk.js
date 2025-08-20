
export const productionHistory = Array(100).fill().map((_, i)=> {
    return {
        time: i <= 2000 ? new Date().toISOString().substr(0, 10) : "",
        oilRate: i <= 2000 ? 1500 + Math.random() * 2000 : "",
        oilRateCalc: i <= 2000 ? 1500 + Math.random() * 2000 : "",
    }
});