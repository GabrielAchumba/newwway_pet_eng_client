import {
    DrainagePoint,
    FluidType,
    InitialGOR,
    InitialCGR,
    AbandonmentGOR,
    AbandonmentCGR,
    InitialBSW,
    InitialWGR,
    AbandonmentBSW,
    AbandonmentWGR,
    InitialOilRate,
    InitialGasRate,
    AbandonmentOilRate,
    AbandonmentGasRate,
    MaximumDrawdown,
    MinimumPwf,
} from "../../../../units_quantities/unitNames";


export const dpConstraintsHeaders = [
    {name2: DrainagePoint, name: DrainagePoint, title: DrainagePoint},
    {name2: FluidType, name: FluidType, title: FluidType},
    {name2: InitialGOR, name: InitialGOR, title: InitialGOR},
    {name2: InitialCGR, name: InitialCGR, title: InitialCGR},
    {name2: AbandonmentGOR, name: AbandonmentGOR, title: AbandonmentGOR},
    {name2: AbandonmentCGR, name: AbandonmentCGR, title: AbandonmentCGR},
    {name2: InitialBSW, name: InitialBSW, title: InitialBSW},
    {name2: InitialWGR, name: InitialWGR, title: InitialWGR},
    {name2: AbandonmentBSW, name: AbandonmentBSW, title: AbandonmentBSW},
    {name2: AbandonmentWGR, name: AbandonmentWGR, title: AbandonmentWGR},
    {name2: InitialOilRate, name: InitialOilRate, title: InitialOilRate},
    {name2: InitialGasRate, name: InitialGasRate, title: InitialGasRate},
    {name2: AbandonmentOilRate, name: AbandonmentOilRate, title: AbandonmentOilRate},
    {name2: AbandonmentGasRate, name: AbandonmentGasRate, title: AbandonmentGasRate},
    {name2: MaximumDrawdown, name: MaximumDrawdown, title: MaximumDrawdown},
    {name2: MinimumPwf, name: MinimumPwf, title: MinimumPwf},
]

export const dialogsDpConstraintsImport = [
    { title: "Import Drainage-Points Constraints Data", isVisible: false, message: "Do you want to import drainage-point constraints data",
    okayEvent: "okDialog", cancelEvent: "cancelDialog" },
    { title: "Success", isVisible: false, message: "Drainage-Points constraints data imported successfully!",
    okayEvent: "okDialog", cancelEvent: "cancelDialog" },
    { title: "Failure", isVisible: false, message: "",
    okayEvent: "okDialog", cancelEvent: "cancelDialog" },
]
