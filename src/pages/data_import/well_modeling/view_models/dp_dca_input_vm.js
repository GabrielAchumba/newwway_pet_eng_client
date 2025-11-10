import {
    DrainagePoint,
    FluidType,
    CumulativeOilProduction,
    CumulativeGasProduction,
    UltimateOilRecovery,
    UltimateGasRecovery,
    PlateauPeriod,
    DCAMethod,
    DeclineRate,
    GORRateofChange,
    CGRRateofChange,
    WatercutRateofChange,
    WGRRateofChange,
} from "../../../../units_quantities/unitNames";

export const dpDCAInputHeaders = [
    {name2: DrainagePoint, name: DrainagePoint, title: DrainagePoint},
    {name2: FluidType, name: FluidType, title: FluidType},
    {name2: CumulativeOilProduction, name: CumulativeOilProduction, title: CumulativeOilProduction},
    {name2: CumulativeGasProduction, name: CumulativeGasProduction, title: CumulativeGasProduction},
    {name2: UltimateOilRecovery, name: UltimateOilRecovery, title: UltimateOilRecovery},
    {name2: UltimateGasRecovery, name: UltimateGasRecovery, title: UltimateGasRecovery},
    {name2: PlateauPeriod, name: PlateauPeriod, title: PlateauPeriod},
    {name2: DCAMethod, name: DCAMethod, title: DCAMethod},
    {name2: DeclineRate, name: DeclineRate, title: DeclineRate},
    {name2: GORRateofChange, name: GORRateofChange, title: GORRateofChange},
    {name2: CGRRateofChange, name: CGRRateofChange, title: CGRRateofChange},
    {name2: WatercutRateofChange, name: WatercutRateofChange, title: WatercutRateofChange},
    {name2: WGRRateofChange, name: WGRRateofChange, title: WGRRateofChange},
]


export const dialogsDpDCAInputImport = [
    { title: "Import Drainage-Points DCA Data", isVisible: false, message: "Do you want to import drainage-point DCA data",
    okayEvent: "okDialog", cancelEvent: "cancelDialog" },
    { title: "Success", isVisible: false, message: "Drainage-Points DCA data imported successfully!",
    okayEvent: "okDialog", cancelEvent: "cancelDialog" },
    { title: "Failure", isVisible: false, message: "",
    okayEvent: "okDialog", cancelEvent: "cancelDialog" },
]
