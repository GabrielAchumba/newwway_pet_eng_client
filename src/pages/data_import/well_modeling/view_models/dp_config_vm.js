import {
    DrainagePoint,
    WellModel,
    OnstreamDate,
    WellType,
    FluidType
} from "../../../../units_quantities/unitNames";



export const dpConfigHeaders = [
    {name2: DrainagePoint, name: DrainagePoint, title: DrainagePoint},
    {name2: WellModel, name: WellModel, title: WellModel},
    {name2: OnstreamDate, name: OnstreamDate, title: OnstreamDate},
    {name2: FluidType, name: FluidType, title: FluidType},
    {name2: WellType, name: WellType, title: WellType},
]

export const dialogsDpConfigImport = [
    { title: "Import Drainage-Points Config Data", isVisible: false, message: "Do you want to import drainage-point config data",
    okayEvent: "okDialog", cancelEvent: "cancelDialog" },
    { title: "Success", isVisible: false, message: "Drainage-Points config data imported successfully!",
    okayEvent: "okDialog", cancelEvent: "cancelDialog" },
    { title: "Failure", isVisible: false, message: "",
    okayEvent: "okDialog", cancelEvent: "cancelDialog" },
]
