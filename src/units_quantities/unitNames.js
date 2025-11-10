import { liquidVolume } from "./liquidVolume";
import { gasVolume } from "./gasVolume";
import { liquidRate } from "./liquidRate";
import { gasRate } from "./gasRate";
import { glr } from "./glr";
import { lgr } from "./lgr";
import { declineRate } from "./declineRate";
import { untiless } from "./unitless";
import { waterCut } from "./waterCut";
import { pressure } from "./pressure";
import { variable_map } from "./variables_mapping";

export const CumulativeOilProduction = "Cumulative Oil Production";
export const CumulativeCondensateProduction = "Cumulative Condensate Production";
export const CumulativeGasProduction = "Cumulative Gas Production";
export const CumulativeWaterProduction = "Cumulative Water Production";
export const CumulativeLiquidProduction = "Cumulative Liquid Production";
export const OilRate = "Oil Rate";
export const CondensateRate = "Condensate Rate";
export const GasRate = "Gas Rate";
export const WaterRate = "Water Rate";
export const LiquidRate = "Liquid Rate";
export const UltimateOilRecovery = "Ultimate Oil Recovery";
export const UltimateGasRecovery = "Ultimate Gas Recovery";
export const GOR_GLR = "GOR/GLR";
export const CGRWGR = "CGR/WGR";
export const DeclineRate = "Decline Rate";
export const GORRateofChange = "GOR Rate of Change";
export const CGRRateofChange = "CGR Rate of Change";
export const WatercutRateofChange = "Watercut Rate of Change";
export const WGRRateofChange = "WGR Rate of Change";
export const Facility = "Facility";
export const Field = "Field";
export const Reservoir = "Reservoir";
export const Well = "Well";
export const String = "String";
export const WellString = "WellString";
export const DrainagePoint = "Drainage Point";
export const FluidType = "Fluid Type";
export const PlateauPeriod = 'Plateau Period';
export const DCAMethod = 'DCA Method';

export const WellModel = "Well Model";
export const OnstreamDate = "Onstream Date";
export const WellType = "Well Type";

export const InitialGOR = 'Initial GOR';
export const InitialCGR = 'Initial CGR';
export const AbandonmentGOR = 'Abandonment GOR';
export const AbandonmentCGR = 'Abandonment CGR';
export const InitialBSW = "Initial BSW";
export const InitialWGR = "Initial WGR";
export const AbandonmentBSW = "Abandonment BSW";
export const AbandonmentWGR = "Abandonment WGR";
export const InitialOilRate = "Initial Oil Rate";
export const InitialGasRate = "Initial Gas Rate";
export const  AbandonmentOilRate =  "Abandonment Oil Rate";
export const  AbandonmentGasRate =  "Abandonment Gas Rate";
export const  MaximumDrawdown =  'Maximum Drawdown';
export const  MinimumPwf =  'Minimum Pwf';




export const unitNames = [
    {unitName: CumulativeOilProduction, inputOptions: [...liquidVolume.options], outputOptions: [...liquidVolume.options], quantity: variable_map.liquidVolume},
    {unitName: CumulativeCondensateProduction, inputOptions: [...liquidVolume.options], outputOptions: [...liquidVolume.options], quantity: variable_map.liquidVolume},
    {unitName: CumulativeGasProduction, inputOptions: [...gasVolume.options], outputOptions: [...gasVolume.options], quantity: variable_map.gasVolume},
    {unitName: CumulativeWaterProduction, inputOptions: [...liquidVolume.options], outputOptions: [...liquidVolume.options], quantity: variable_map.liquidVolume},
    {unitName: CumulativeLiquidProduction, inputOptions: [...liquidVolume.options], outputOptions: [...liquidVolume.options], quantity: variable_map.liquidVolume},
    {unitName: OilRate, inputOptions: [...liquidRate.options], outputOptions: [...liquidRate.options], quantity: variable_map.liquidRate},
    {unitName: CondensateRate, inputOptions: [...liquidRate.options], outputOptions: [...liquidRate.options], quantity: variable_map.liquidRate},
    {unitName: GasRate, inputOptions: [...gasRate.options], outputOptions: [...gasRate.options], quantity: variable_map.gasRate},
    {unitName: WaterRate, inputOptions: [...liquidRate.options], outputOptions: [...liquidRate.options], quantity: variable_map.liquidRate},
    {unitName: LiquidRate, inputOptions: [...liquidRate.options], outputOptions: [...liquidRate.options], quantity: variable_map.liquidRate},
    {unitName: UltimateOilRecovery, inputOptions: [...liquidVolume.options], outputOptions: [...liquidVolume.options], quantity: variable_map.liquidVolume},
    {unitName: UltimateGasRecovery, inputOptions: [...gasVolume.options], outputOptions: [...gasVolume.options], quantity: variable_map.gasVolume},
    {unitName: GOR_GLR, inputOptions: [...glr.options], outputOptions: [...glr.options], quantity: variable_map.glr},
    {unitName: CGRWGR, inputOptions: [...lgr.options], outputOptions: [...lgr.options], quantity: variable_map.lgr},
    {unitName: DeclineRate, inputOptions: [...declineRate.options], outputOptions: [...declineRate.options], quantity: variable_map.declineRate},
    {unitName: GORRateofChange, inputOptions: [...declineRate.options], outputOptions: [...declineRate.options], quantity: variable_map.declineRate},
    {unitName: CGRRateofChange, inputOptions: [...declineRate.options], outputOptions: [...declineRate.options], quantity: variable_map.declineRate},
    {unitName: WatercutRateofChange, inputOptions: [...declineRate.options], outputOptions: [...declineRate.options], quantity: variable_map.declineRate},
    {unitName: WGRRateofChange, inputOptions: [...declineRate.options], outputOptions: [...declineRate.options], quantity: variable_map.declineRate},
    {unitName: Facility, inputOptions: [...untiless.options], outputOptions: [...untiless.options], quantity: variable_map.untiless},
    {unitName: Field, inputOptions: [...untiless.options], outputOptions: [...untiless.options], quantity: variable_map.untiless},
    {unitName: Reservoir, inputOptions: [...untiless.options], outputOptions: [...untiless.options], quantity: variable_map.untiless},
    {unitName: Well, inputOptions: [...untiless.options], outputOptions: [...untiless.options], quantity: variable_map.untiless},
    {unitName: String, inputOptions: [...untiless.options], outputOptions: [...untiless.options], quantity: variable_map.untiless},
    {unitName: WellString, inputOptions: [...untiless.options], outputOptions: [...untiless.options], quantity: variable_map.untiless},
    {unitName: DrainagePoint, inputOptions: [...untiless.options], outputOptions: [...untiless.options], quantity: variable_map.untiless},
    {unitName: FluidType, inputOptions: [...untiless.options], outputOptions: [...untiless.options], quantity: variable_map.untiless},
    {unitName: PlateauPeriod, inputOptions: [...untiless.options], outputOptions: [...untiless.options], quantity: variable_map.untiless},
    {unitName: DCAMethod, inputOptions: [...untiless.options], outputOptions: [...untiless.options], quantity: variable_map.untiless},
    {unitName: WellModel, inputOptions: [...untiless.options], outputOptions: [...untiless.options], quantity: variable_map.untiless},
    {unitName: OnstreamDate, inputOptions: [...untiless.options], outputOptions: [...untiless.options], quantity: variable_map.untiless},
    {unitName: WellType, inputOptions: [...untiless.options], outputOptions: [...untiless.options], quantity: variable_map.untiless},
    {unitName: InitialGOR, inputOptions: [...glr.options], outputOptions: [...glr.options], quantity: variable_map.glr},
    {unitName: InitialCGR, inputOptions: [...lgr.options], outputOptions: [...lgr.options], quantity: variable_map.lgr},
    {unitName: AbandonmentGOR, inputOptions: [...glr.options], outputOptions: [...glr.options], quantity: variable_map.glr},
    {unitName: AbandonmentCGR, inputOptions: [...lgr.options], outputOptions: [...lgr.options], quantity: variable_map.lgr},
    {unitName: InitialWGR, inputOptions: [...lgr.options], outputOptions: [...lgr.options], quantity: variable_map.lgr},
    {unitName: AbandonmentWGR, inputOptions: [...lgr.options], outputOptions: [...lgr.options], quantity: variable_map.lgr},
    {unitName: InitialOilRate, inputOptions: [...liquidRate.options], outputOptions: [...liquidRate.options], quantity: variable_map.liquidRate},
    {unitName: AbandonmentOilRate, inputOptions: [...liquidRate.options], outputOptions: [...liquidRate.options], quantity: variable_map.liquidRate},
    {unitName: InitialGasRate, inputOptions: [...gasRate.options], outputOptions: [...gasRate.options], quantity: variable_map.gasRate},
    {unitName: AbandonmentGasRate, inputOptions: [...gasRate.options], outputOptions: [...gasRate.options], quantity: variable_map.gasRate},
    {unitName: InitialBSW, inputOptions: [...waterCut.options], outputOptions: [...waterCut.options], quantity: variable_map.waterCut},
    {unitName: AbandonmentBSW, inputOptions: [...waterCut.options], outputOptions: [...waterCut.options], quantity: variable_map.waterCut},
    {unitName: MaximumDrawdown, inputOptions: [...pressure.options], outputOptions: [...pressure.options], quantity: variable_map.pressure},
    {unitName: MinimumPwf, inputOptions: [...pressure.options], outputOptions: [...pressure.options], quantity: variable_map.pressure},
];

export const unitNamesRecord = unitNames.reduce((acc, unit) => {
              acc[unit.unitName] = {
                  inputOptions: unit.inputOptions,
                  unitName: unit.unitName,
                  outputOptions: unit.outputOptions,
                  quantity: unit.quantity
              };
              return acc;
            }, {});