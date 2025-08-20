const importMethodForm = { 
    title: "Text File Import Methods",
    qSelects: [
        { label: "Import Method", value: "", type: "text", list: [], actionName: "onImportMethodSelected", visible: true },
    ],
    qInputs: [],
    qBtns: [
        {label: "Done", name: "doneImportMethodSelection", icon: "done"},
    ],
}

const dialogs = [
    { title: "Text File Import Methods", isVisible: false, message: "",
    okayEvent: "okDialog", cancelEvent: "cancelDialog" },
]

export { importMethodForm, dialogs }