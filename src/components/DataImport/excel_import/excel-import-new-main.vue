<template>
  <div class="excel-import-page" style="scrollbar-width: none; height: 100vh;">
    <!-- Card Container -->
    <div v-if="!showSpinner" class="row flex flex-center">
      <q-card class="import-card">
        <!-- Header -->
        <q-bar class="card-header">
          <div class="text-h6 text-center">{{ title }}</div>
        </q-bar>

        <q-separator v-if="visibile" />

        <!-- First Section -->
        <!-- <q-card-section v-if="visibile" class="card-section">
          <q-form class="q-pa-sm">
            <ReadWorksheet
              v-for="qSelect in form.qSelects"
              :key="qSelect.label"
              :qSelect="qSelect"
              @onFileSelected="onFileSelected($event)"
              @onQSelectItemValueChanged="onWorksheetChanged($event)"
            />
          </q-form>
        </q-card-section>

        <q-separator v-if="visibile" /> -->

        <!-- Mapping Section -->
        <q-card-section v-if="visibile" class="card-section">
          <q-form class="q-pa-sm">
            <MapVariables
              :applicationColumns="applicationColumns"
              :worksheetColumns="worksheetColumns"
              :dataTypes="dataTypes"
              :worksheetQSelects="form.qSelects"
              @onApplicationColumnChanged="onApplicationColumnChanged($event)"
              @onWorksheetColumnChanged="onWorksheetColumnChanged($event)"
              @onDataTypeChanged="onDataTypeChanged($event)"
              @onToggle="onToggle($event)"
              @onFileSelected="onFileSelected($event)"
              @onQSelectItemValueChanged="onWorksheetChanged($event)"
              @onExcelDataStartRowChanged="onExcelDataStartRowChanged($event)"
            />
          </q-form>
        </q-card-section>

        <!-- Table Section -->
        <q-card-section v-else class="card-section">
          <Table 
          :table_VM="tableVM" 
          :tableRows="tableVM.rows" />
        </q-card-section>

        <q-separator />

        <!-- Actions -->
        <q-card-actions align="right" class="action-section">
          <div v-if="setIsResponsive" class="row">
            <q-space />
            <q-icon
              v-for="qBtn in form.qBtns"
              :key="qBtn.label"
              :name="qBtn.icon"
              class="action-icon"
              @click="ClickAction(qBtn.name)"
              size="30px"
            >
              <q-tooltip>{{ qBtn.label }}</q-tooltip>
            </q-icon>
          </div>
          <div v-else class="row">
            <q-space />
            <q-btn
              v-for="qBtn in form.qBtns"
              :key="qBtn.label"
              :label="qBtn.label"
              type="button"
              size="md"
              :icon="qBtn.icon"
              no-caps
              class="action-btn"
              @click="ClickAction(qBtn.name)"
            />
          </div>
        </q-card-actions>
      </q-card>
    </div>

    <!-- Spinner -->
    <div v-show="showSpinner" class="spinner-container">
      <q-spinner color="secondary" size="8em" :thickness="10" />
    </div>

    <!-- Dialog -->
    <q-dialog v-model="dialogs[0].isVisible">
      <Form
        style="width: 400px;"
        :formData="importMethodForm"
        @doneImportMethodSelection="doneImportMethodSelection($event)"
        @onImportMethodSelected="onImportMethodSelected($event)"
      />
    </q-dialog>
  </div>
</template>

<script>

import { useAuthStore } from 'src/store/modules/authStore';
import Form from "../../forms/Form.vue";
// import { MathJax } from 'mathjax-vue'
// import { VueMathjax } from 'vue-mathjax'
import * as xlsx from 'xlsx/xlsx.mjs';
import { form } from "./excel-import-main-vm";
import { importMethodForm, dialogs } from "./import-method-view-model";
import ReadWorksheet from "./read-worksheet.vue";
import MapVariables from "./mapVariablesNew.vue";
import Table from "../../tables/Table.vue";

const authStore = useAuthStore();

export default {
    computed:{
        setIsResponsive(){
            const width = window.innerWidth;
            if(width < 700) return true;
            else return false;
        },
        showSpinner(){
            return authStore.showSpinner;
        },
        spinnerSize(){
            return authStore.spinnerSize;
        },
        spinnerThickness(){
            return authStore.spinnerThickness;
        },
        workSheetsNames(){
            return authStore.workSheetsNames;
        },
        workSheetsData(){
            return authStore.workSheetsData;
        }
    },
    components:{
        ReadWorksheet,
        MapVariables,
        Table,
        Form,
        // MathJax,
        // 'vue-mathjax': VueMathjax,
    },
    props:{
        title: {
            type: String,
            default: ""
        },
        _applicationColumns: {
            type: Array,
            default: () => {
                return [{
                     isToggle: true,
                    qToggle: { name: true, label: ""}
                }]
            }
        },
    },
    data(){
        return {
            mathExpression: "$$2^x.$$", // `$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.$$`,
            num: 16,
            msExcelDataStartRow: 0,
            applicationColumns:[{
                    isToggle: true,
                qToggle: { name: true, label: ""}
            }],
            visibile: true,
            selectedWorkSheetData: {},
            dataTypes: [],
            worksheetColumns: [],
            form: form,
            tableVM: {
                selectedStaff: {},
                title: "Imported Data",
                columns: [],
                columnsOriginal: [],
                rows: [],
                separator: "cell",
                /* createItem: "createStaff",
                updateItem: "updateStaff",
                deleteItem: "deleteStaff",
                createItemUrl: "/create-staff",
                updateItemUrl: "/update-staff",
                importURL: "/import-staff", */
            },
            selectedFile: null,
            importMethodForm: importMethodForm,
            dialogs: dialogs,
            lines: [],
            selectedTextFileImportMethod: "Method 1",
        }
    },
    methods:{
        onExcelDataStartRowChanged(payload){
            var context = this;
            console.log(payload)
            context.msExcelDataStartRow = payload;
        },
        onWorksheetChanged(qSelect){
            var context = this;
            context.setWorkSheetColumns(qSelect.value.sheetData);
        },
        onApplicationColumnChanged(qSelect){
            var context = this;
            context.applicationColumns[qSelect.sn].value = qSelect.value.value;
        },
        onWorksheetColumnChanged(qSelect){
            var context = this;
            context.worksheetColumns[qSelect.sn].value = qSelect.value.value;
        },
        onDataTypeChanged(qSelect){
            var context = this;
            context.dataTypes[qSelect.sn].value = qSelect.value.value;
        },
        onToggle(payload){
            var context = this;
            context.tableVM.columnsOriginal[payload.qSelect.sn].data.qToggle.name = payload.evt;
        },
        ClickAction(actionName){
            var context = this;
            switch(actionName){
                case "Preview":
                    context.setTableData();
                    if(context.visibile === true){
                        context.visibile = false;
                    }else{
                        context.visibile = true;
                    }
                    break;
                case "Save":
                    context.setTableData();
                    context.saveTable();
                    break;
                case "CancelImportAction":
                    context.CancelImportAction();
                    break;
            }

        },
        CancelImportAction(){
            console.log("CancelImportAction called")
            this.$emit("cancelImportAction")
        },
        saveTable(){
            var context = this;
            this.$emit("saveTable", context.tableVM.rows);
        },
        setTableData(){
            var context = this;
            context.tableVM.rows = [];
            console.log("context.selectedWorkSheetData: ", context.selectedWorkSheetData)
            console.log("context.tableVM.columnsOriginal: ", context.tableVM.columnsOriginal)
            let ii = -1;
            for(const selectedWorkSheetRow of context.selectedWorkSheetData){
                ii++;
                const tableRow = context.setTableRow(selectedWorkSheetRow);
                let newRow = {};
                for(const column of context.tableVM.columnsOriginal){
                    if(column.data.qToggle.name === true){
                        newRow[column.name] = tableRow[column.name]
                    }
                }
                if(ii >= context.msExcelDataStartRow -1){
                    context.tableVM.rows.push({...newRow});
                }
                
            }

            console.log("context.tableVM.rows: ", context.tableVM.rows)
            if(context.tableVM.rows.length > 0){
                const keys = Object.keys(context.tableVM.rows[0]);
                context.tableVM.columns = keys.map((row) => {
                    return { name: `${row}`, label: `${row.toUpperCase()}`, field: "", align: "left", type: "" }
                })
                
                console.log("tableVM: ", context.tableVM)
                authStore.setStateData("newRows", context.tableVM.rows);
            }

        },
        setTableRow(selectedWorkSheetRow){
            var context = this;
            const tableRow = {};
            let i = -1;
            for(const applicationColumn of context.applicationColumns){
                i++;
                switch(context.dataTypes[i].value){
                    case "text":
                        tableRow[`${applicationColumn.value}`] = selectedWorkSheetRow[context.worksheetColumns[i].value];
                        break;
                    case "number":
                        tableRow[`${applicationColumn.value}`] = selectedWorkSheetRow[context.worksheetColumns[i].value];
                        break;
                    case "date":
                        if (selectedWorkSheetRow[context.worksheetColumns[i].value] instanceof Date) {
                            var date = selectedWorkSheetRow[context.worksheetColumns[i].value];
                            // Add a day because of GMT + 1
                            date.setDate(date.getDate() + 1)

                            const day = date.getDate();
                            const month = date.getMonth() + 1;
                            const year = date.getFullYear();
                            tableRow[`${applicationColumn.value}`] =  `${month}/${day}/${year}`;
                        }else{
                            tableRow[`${applicationColumn.value}`] =   selectedWorkSheetRow[context.worksheetColumns[i].value];
                        }
                        break;
                    case "boolean":
                        tableRow[`${applicationColumn.value}`] =  selectedWorkSheetRow[context.worksheetColumns[i].value];
                        break;
                }
            }


            return tableRow;
        },
        setWorkSheetColumns(selectedWorkSheetData){
            console.log("selectedWorkSheetData: ", selectedWorkSheetData);
            var context = this;
            context.selectedWorkSheetData = selectedWorkSheetData;
            
            if(Object.keys(selectedWorkSheetData).length > 0){
                const selectedWorkSheetDataColumns = Object.keys(selectedWorkSheetData["0"])
                const qSelect = { label: "", value: "", type: "text", 
                                list: [], actionName: "referedByAction", visible: true,
                                isToggle: false,
                                qToggle: { name: true, label: ""}}

                qSelect.list = selectedWorkSheetDataColumns.map((row) => {
                    return {
                        type: row,
                        value: row,
                        label: row,
                    }
                })
              
                const nRows = context.applicationColumns.length;
                context.worksheetColumns = [];
                for(let i = 0; i < nRows; i++){
                    context.worksheetColumns.push({...qSelect})
                    context.worksheetColumns[i].id = i;
                    context.worksheetColumns[i].value =  context.worksheetColumns[i].list[0].value;
                    context.worksheetColumns[i].sn = i;
                }

                console.log("context.applicationColumns: ", context.applicationColumns)
                console.log("context.worksheetColumns: ", context.worksheetColumns)
                
            }
        },
        setDataTypes(){
            var context = this;
            const dataTypes = ["text", "number", "date", "boolean"];
            const qSelect = { label: "", value: "", type: "text", 
                            list: [], actionName: "referedByAction", visible: true,
                            isToggle: false,
                            qToggle: { name: true, label: ""} }

            qSelect.list = dataTypes.map((row) => {
                return {
                    type: row,
                    value: row,
                    label: row,
                }
            })

            const nRows = context._applicationColumns.length;
            for(let i = 0; i < nRows; i++){
                context.dataTypes.push({...qSelect})
                context.dataTypes[i].id = `Data Type ${i+1}`;
                context.dataTypes[i].value =  context.dataTypes[i].list[0].value;
                context.dataTypes[i].sn = i;
            }

            console.log("context.dataTypes: ", context.dataTypes)
        },
        dialogFailureOrScuess(dialogTitle, isVisible){
          const context = this;
            var i = -1;
            for(const dialog of context.dialogs){
                i++;
                 context.dialogs[i].isVisible = false;
                if(dialog.title == dialogTitle){
                    context.dialogs[i].isVisible = isVisible;
                }
            }
        },
        onFileSelected(payload){
            var context = this;
            context.selectedFile = payload.selectedFile;
            if(context.selectedFile){
                if (/\.(xls|xlsx)$/i.test(context.selectedFile.name)) {
                    context.msExcelFileImportMethod();
                }else if (/\.(txt)$/i.test(context.selectedFile.name)) {
                    context.dialogFailureOrScuess("Text File Import Methods", true);
                }
            }
        },
        doneImportMethodSelection(payload){
            var context = this;
            context.dialogFailureOrScuess("Text File Import Methods", false);
            context.textFileImportMethod();
        },
        onImportMethodSelected(payload){
            var context = this;
            let selectedItem = payload.list.find(o => o.id === payload.value);
            context.selectedTextFileImportMethod = selectedItem.label;
            console.log("context.selectedTextFileImportMethod: ", context.selectedTextFileImportMethod)
        },
        msExcelFileImportMethod(){
            var context = this;
            let workSheetsNames = [];
            let workSheetsData = [];
            let reader  = new FileReader();
            authStore.setStateData("showSpinner", true);
            reader.onload = ev => {
                
                try {
                    const data =  ev.target.result;
                    const XLSX = xlsx;
                    const workbook = XLSX.read(data, {
                        type: "binary",
                        cellDates: true,
                        cellNF: false,
                        cellText: false
                    });
                    var nCount = workbook.SheetNames.length;
                    console.log("nCount: ", nCount)
                    var i = 0;
                    var j = 0;
                    workSheetsNames = [];
                    workSheetsData = [];
                    for(j = 0; j < nCount; j++){
                        var wsname = workbook.SheetNames[j];
                        console.log("wsname: ", wsname)
                        workSheetsNames.push(wsname);
                        var ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname], {raw: true, defval:null});
                        const excellist = [];
          
                        for (i = 0; i < ws.length; i++) {
                            excellist.push(ws[i]);
                        }
                        console.log("excellist: ", excellist)
                        workSheetsData.push(excellist);
                    }

                    context.setImportFormData(workSheetsNames, workSheetsData);
                    context.filesReadingCompleted(workSheetsNames, workSheetsData);
                } catch (e) {
                    console.log("e: ", e)
                    alert("Read failure!");
                    context.filesReadingCompleted(workSheetsNames, workSheetsData);
                }
            }
            if(context.selectedFile){
                if (/\.(xls|xlsx)$/i.test(context.selectedFile.name)) {
                    //readAsDataURL
                    //readAsBinaryString
						reader.readAsBinaryString(context.selectedFile);
				}else{
                    alert("Wrong Microsoft Excel Format. Only supports .xls or .xlsx")
                }
            }
        },
        adjustLineOfTextFile(){
            //context.lines
            var context = this;
             const columns = [];
                let constantColumnsStartIndex = -1;
                for(let i = 1; i < context.lines.length; i++){
                    if(context.lines[i] === "#@ConstantColumns@#") {
                        constantColumnsStartIndex = i + 1;
                        break;
                    }
                    columns.push({
                        name: context.lines[i] == undefined ? "" : context.lines[i].replace('\t','')
                    }) 
                }

                //console.log("columns: ", columns)

                const constantColumns = [];
                let constantColumnsValuesStartIndex = -1;
                for(let i = constantColumnsStartIndex; i < context.lines.length; i++){
                    if(context.lines[i] === "#@ConstantColumnsValues@#") {
                        constantColumnsValuesStartIndex = i + 1;
                        break;
                    }
                    constantColumns.push({
                        name: context.lines[i] == undefined ? "" : context.lines[i].replace('\t','')
                    }) 
                }
                //console.log("constantColumns: ", constantColumns)

                const constantColumnsValues = [];
                let rowStartIndex = -1;
                for(let i = constantColumnsValuesStartIndex; i < context.lines.length; i++){
                    if(context.lines[i] === "#@Rows@#") {
                        rowStartIndex = i + 1;
                        break;
                    }
                    constantColumnsValues.push({
                        value: context.lines[i] == undefined ? "" : context.lines[i].replace('\t','')
                    }) 
                }
                //console.log("constantColumnsValues: ", constantColumnsValues)


                const nonConstantColumns = [];
                for(let i = 0; i < columns.length; i++){
                    let check = false;
                    for(let j = 0; j < constantColumns.length; j++){
                        if(columns[i].name === constantColumns[j].name){
                            check = true;
                            break;
                        }
                    }
                    if(!check){
                        nonConstantColumns.push({
                            name: columns[i].name
                        }) 
                    }
                }
                //console.log("nonConstantColumns: ", nonConstantColumns)
          
                const step = nonConstantColumns.length;
                let sn = 0;
                const options = ["A", "B", "C", "D", "E", "F", "G"];
                try {
                    for (let i = rowStartIndex; i < context.lines.length; i = i + step) {
                        let row = {}
                        sn++;
                        for(let j = 0; j < nonConstantColumns.length; j++){
                            //console.log("sn: ", sn)
                            let line =  context.lines[i + j].trim();
                            if(j === 0){
                                line = line.replace(`${sn}.`,'').trim();
                                context.lines[i + j] = line;
                            }else if(j === nonConstantColumns.length-1){
                                line = line.trim();
                                context.lines[i + j] = line;
                            }else{
                                line = line.replace(`${options[j-1]}.`,'').trim();
                                context.lines[i + j] = line;
                            }
                            //if(sn === 1) console.log("line: ", line)
                        }
                    }
                    
                }catch(e){
                    console.log("error: ", e)
                }
        },
        textFileImportMethod(){
            var context = this;
            let workSheetsNames = [];
            let workSheetsData = [];
            let readerText  = new FileReader();
            authStore.setStateData("showSpinner", true);
            
            readerText.addEventListener("load", function () {
                context.lines = readerText.result.split("\n");
                if(context.selectedTextFileImportMethod === "Method 2"){
                    context.adjustLineOfTextFile()
                }

                const excellist = [];

                const columns = [];
                let constantColumnsStartIndex = -1;
                for(let i = 1; i < context.lines.length; i++){
                    if(context.lines[i] === "#@ConstantColumns@#") {
                        constantColumnsStartIndex = i + 1;
                        break;
                    }
                    columns.push({
                        name: context.lines[i] == undefined ? "" : context.lines[i].replace('\t','')
                    }) 
                }

                //console.log("columns: ", columns)

                const constantColumns = [];
                let constantColumnsValuesStartIndex = -1;
                for(let i = constantColumnsStartIndex; i < context.lines.length; i++){
                    if(context.lines[i] === "#@ConstantColumnsValues@#") {
                        constantColumnsValuesStartIndex = i + 1;
                        break;
                    }
                    constantColumns.push({
                        name: context.lines[i] == undefined ? "" : context.lines[i].replace('\t','')
                    }) 
                }
                //console.log("constantColumns: ", constantColumns)

                const constantColumnsValues = [];
                let rowStartIndex = -1;
                for(let i = constantColumnsValuesStartIndex; i < context.lines.length; i++){
                    if(context.lines[i] === "#@Rows@#") {
                        rowStartIndex = i + 1;
                        break;
                    }
                    constantColumnsValues.push({
                        value: context.lines[i] == undefined ? "" : context.lines[i].replace('\t','')
                    }) 
                }
                //console.log("constantColumnsValues: ", constantColumnsValues)


                const nonConstantColumns = [];
                for(let i = 0; i < columns.length; i++){
                    let check = false;
                    for(let j = 0; j < constantColumns.length; j++){
                        if(columns[i].name === constantColumns[j].name){
                            check = true;
                            break;
                        }
                    }
                    if(!check){
                        nonConstantColumns.push({
                            name: columns[i].name
                        }) 
                    }
                }
                //console.log("nonConstantColumns: ", nonConstantColumns)
          
                const step = nonConstantColumns.length;
                for (let i = rowStartIndex; i < context.lines.length; i = i + step) {
                    let row = {}
                     for(let j = 0; j < constantColumns.length; j++){
                        row[constantColumns[j].name] = constantColumnsValues[j].value == undefined ? "" : constantColumnsValues[j].value.replace('\t','')
                    }

                    for(let j = 0; j < nonConstantColumns.length; j++){
                        row[nonConstantColumns[j].name] = context.lines[i + j] == undefined ? "" : context.lines[i + j].replace('\t','')
                    }
                    if(row[nonConstantColumns[0].name] !== "") excellist.push({...row});
                }
                workSheetsData.push(excellist);
                //console.log("workSheetsNames: ", workSheetsNames)
                //console.log("workSheetsData: ", workSheetsData)
                context.setImportFormData(workSheetsNames, workSheetsData);
                context.filesReadingCompleted(workSheetsNames, workSheetsData);
            }.bind(context), false);

            if(context.selectedFile){
                if (/\.(txt)$/i.test(context.selectedFile.name)) {
                    workSheetsNames = [];
                    workSheetsData = [];
                    workSheetsNames.push(context.selectedFile.name);
					readerText.readAsText(context.selectedFile);
				}else{
                    alert("Wrong file format. Only supports .txt")
                }
            }
        },
        setImportFormData(workSheetsNames, workSheetsData){
            //console.log("setImportFormData started")
            var context = this;
            if(workSheetsNames.length > 0){
                context.form.qSelects[0].list = workSheetsNames.map((row, index) => {
                    return {
                        type: row,
                        value: row,
                        sheetData: workSheetsData[index]
                    }
                })
            }
            //console.log("context.applicationColumns: ", context.applicationColumns)
            //console.log("setImportFormData completed")
        },
        filesReadingCompleted(workSheetsNames, workSheetsData){
            var context = this;
            //console.log("filesReadingCompleted started")
    
            authStore.setStateData("workSheetsNames", workSheetsNames);
            authStore.setStateData("workSheetsData", workSheetsData);
            authStore.setStateData("showSpinner", false);
            //console.log("context.applicationColumns: ", context.applicationColumns)
            //console.log("filesReadingCompleted completed")
        },
        /* renderMath() {
            this.$nextTick(() => {
                MathLive.renderMathInElement(this.$refs.math);
            });
        }, */
        renderMath: function (event) {
        this.$nextTick(function(){
            MathLive.renderMathInElement("math");
        })
        }
    },
    mounted() {
        console.log("Hello This is created!");
         //this.renderMath();
    },
    created(){
        var context = this;
        
        context.form.clearQSelects();
        context.setImportFormData(context.workSheetsNames, context.workSheetsData);
        context.setDataTypes();
        context.applicationColumns = context._applicationColumns.map((row) => {
            return {
                ...row, 
                isToggle: true,
                qToggle: { name: true, label: ""},
            }
        })
        context.worksheetColumns = context.applicationColumns.map((row, index) => {
            return {
                ...row,
                isToggle: false,
                i: `Worksheet Column ${index+1}`
            }
        })

        context.tableVM.columnsOriginal = context.applicationColumns.map((row) => {
                    return { data: {...row}, name: `${row.value}`, label: `${row.value.toUpperCase()}`, field: "", align: "left", type: "" }
        })

        const methods = ["Method 1", "Method 2"]
        context.importMethodForm.qSelects[0].list = methods.map((row, i) => {
            return {
                id: i,
                type: row,
                value: row,
                label: row
            }
        })
        console.log("importMethodForm: ", context.importMethodForm)
        if(context.importMethodForm.qSelects[0].list.length > 0){
           context.importMethodForm.qSelects[0].value = context.importMethodForm.qSelects[0].list[0].id;
        }

        console.log("context._applicationColumns: ", context._applicationColumns)

        //console.log("context.applicationColumns: ", context.applicationColumns)


    }
}
</script>

<style lang="scss" scoped>
@use "sass:color";

.excel-import-page {
  //background-color: red;
  min-height: 100vh;
  overflow-y: scroll;

  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

.import-card {
     //background-color: green;
  width: 100%;
  //height: 100vh;
  max-width: 1100px;
//   box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
//   border-radius: 16px;
  overflow: hidden;
}

.card-header {
  background-color: $secondary;
  color: $primary;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 12px 16px;
}

.card-section {
  background-color: $primary;
  color: $secondary;
  padding: 16px;
}

.action-section {
  background-color: $primary;
  padding: 12px;
}

.action-btn {
  background-color: $secondary;
  color: $primary;
//   border-radius: 8px;
  transition: all 0.3s ease;
  &:hover {
    background-color: color.adjust($secondary, $lightness: 10%);
  }
}

.action-icon {
  padding: 8px;
  color: $accent;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.15);
    color: color.adjust($accent, $lightness: -10%);
  }
}

.spinner-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

