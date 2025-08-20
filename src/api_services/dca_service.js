import { dcaOptions } from "src/temp_database/decline_curve_analysis/dca_options_bk";
import { dca_simuation_assetExplorer } from "src/temp_database/decline_curve_analysis/dca_simulation_bk";

export const fetchDCAOptions = () => {
    return dcaOptions;
}

export const fetchDCASimuationAssetExplorer = () => {
    return dca_simuation_assetExplorer;
}