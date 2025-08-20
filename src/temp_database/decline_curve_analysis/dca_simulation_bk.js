import { wells } from "src/temp_database/assets/wells_bk";

export const dca_simuation_assetExplorer = wells.map((row=>({
    label: row.label,
    checked: false,
    description: '',
    decline: 'Exponential',
    productionStart: new Date().toISOString().substr(0, 10),
    exponent: 0.4,
    abandonmentRate: 500,
    declineRates: Array(3000).fill().map((_, i) => ({
        id: i,
        time: i <= 3 ? new Date().toISOString().substr(0, 10) : "",
        initialRate: i <= 3 ? 1500 + Math.random() * 2000 : "",
        declineRate: i <= 3 ? 0.002 + Math.random() * 0.002 : "",
        exponent: i <= 3 ? 0.2 + Math.random() * 0.4 : "",
    })), 
})))

