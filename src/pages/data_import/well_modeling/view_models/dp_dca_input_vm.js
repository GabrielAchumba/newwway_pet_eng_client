export const dpDCAInputHeaders = [
    {name2: "Drainage Point", name: "Drainage Point", title: "Drainage Point"},
    {name2: "Fluid Type", name: "Fluid Type", title: "Fluid Type"},
    {name2: "Initial Cumulative Oil Production", name: "Initial Cumulative Oil Production", title: "Initial Cumulative Oil Production"},
    {name2: "Initial Cumulative Gas Production", name: "Initial Cumulative Gas Production", title: "Initial Cumulative Gas Production"},
    {name2: "Oil Ultimate Recovery", name: "Oil Ultimate Recovery", title: "Oil Ultimate Recovery"},
    {name2: "Gas Ultimate Recovery", name: "Gas Ultimate Recovery", title: "Gas Ultimate Recovery"},
    {name2: 'Plateau Period', name: 'Plateau Period', title: 'Plateau Period'},
    {name2: 'DCA Method', name: 'DCA Method', title: 'DCA Method'},
    {name2: "Rate Decline Rate", name: "Rate Decline Rate", title: "Rate Decline Rate"},
    {name2: "GOR/CGR Rate of Change", name: "GOR/CGR Rate of Change", title: "GOR/CGR Rate of Change"},
    {name2: "BSW/WGR Rate of Change", name: "BSW/WGR Rate of Change", title: "BSW/WGR Rate of Change"},
]


export const dialogsDpDCAInputImport = [
    { title: "Import Drainage-Points DCA Data", isVisible: false, message: "Do you want to import drainage-point DCA data",
    okayEvent: "okDialog", cancelEvent: "cancelDialog" },
    { title: "Success", isVisible: false, message: "Drainage-Points DCA data imported successfully!",
    okayEvent: "okDialog", cancelEvent: "cancelDialog" },
    { title: "Failure", isVisible: false, message: "",
    okayEvent: "okDialog", cancelEvent: "cancelDialog" },
]
