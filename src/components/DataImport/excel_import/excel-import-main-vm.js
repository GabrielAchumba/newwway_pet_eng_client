const form = {
    title: "Data Import",
    qSelects: [
         { label: "Select Worksheet *", value: "", type: "text", 
         list: [], actionName: "referedByAction", visible: true,
         isToggle: false,
         qToggle: { name: true, label: ""}, }
    ],
    qBtns: [
        {label: "Preview", name: "Preview", icon: "preview"},
        {label: "Done", name: "Save", icon: "save"},
        {label: "Cancel", name: "CancelImportAction", icon: "save"},
    ],
    clearQSelects(){
        var i = 0;
        for (i = 0; i < this.qSelects.length; i++){
            this.qSelects[i].value = "";
            this.qSelects[i].list = [];
            this.qSelects[i].visible = true;
        }
    },
}

export { form }