<template>
    <div>
        <div class="row"
        v-if="!showSpinner">
        <ExcelImport
        class="col-12"
        :title="title"
        :_applicationColumns="applicationColumns"
        @saveTable="Create($event)"
        @cancelImportAction="cancelImportAction"/>

        </div>
        <div 
        v-show="showSpinner"
        class="q-gutter-md row">
            <div class="col-12 q-pa-sm absolute-center flex flex-center">
                <q-spinner
                    color="accent"
                    :size="spinnerSize"
                    :thickness="spinnerThickness"
                />
            </div>
        </div>

        <q-dialog 
            v-for="dialog in dialogs" 
            :key="dialog.title"
            v-model="dialog.isVisible">
            <MessageBox
            :title="dialog.title"
            :message="dialog.message"
            :okayEvent="dialog.okayEvent"
            :cancelEvent="dialog.cancelEvent"
            @cancelDialog="cancelDialog($event)"
            @okDialog="okDialog($event)"
            >
            </MessageBox>
        </q-dialog>
    </div>
</template>

<script>

//import { storeToRefs } from 'pinia';
import MessageBox from "../../../components/dialogs/MessageBox.vue";
import ExcelImport from "../../../components/DataImport/excel_import/excel-import-new-main.vue";
import { useAuthStore } from 'src/store/modules/authStore';
import { dpConstraintsHeaders, dialogsDpConstraintsImport } from "./view_models/dp_constraints_vm";
import { usePropertyGridStore } from 'src/store/modules/propertyGridStore';
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';
import { useAssetGroupsStore } from 'src/store/modules/assetGroupsStore';
import { useRouter } from 'vue-router'
import { createBulkConstraints } from "src/api_services/drainage_point_input";
import { constraintConditions , constraintUnits } from "src/constants/initial_assets";

const authStore = useAuthStore();
const router = useRouter();
const propertyGridStore = usePropertyGridStore();
const assetsExplorerStore = useAssetsExplorerStore();
const assetGroupsStore = useAssetGroupsStore();

//const { listItems } = storeToRefs(assetsExplorerStore);


export default {
    computed:{
        showSpinner(){
            return authStore.showSpinner;
        },
        spinnerSize(){
            return authStore.spinnerSize;
        },
        spinnerThickness(){
            return authStore.spinnerThickness;
        },
        assetGroups(){
            return assetGroupsStore.assetGroups;
        },
        selectedAssetGroup(){
            return assetGroupsStore.selectedAssetGroup;
        }
    },
    components:{
        ExcelImport,
        MessageBox,
    },
    data(){
        return {
            title: "Import Drainage-Points Constraints Data",
            appVariables: dpConstraintsHeaders,
            applicationColumns: [],
            dialogs: dialogsDpConstraintsImport,
            tableRows: [],
            isImportComplete: false,
            productionHistoryCollection: [],
            payload: [],
            drainagePoints: []
        }
    },
    methods:{
        Create(tableRows){
            const context = this;
            context.tableRows = tableRows;

            console.log(context.assetGroups);
            console.log(context.selectedAssetGroup);
             console.log(tableRows);

             context.payload = [];

            for (const row of tableRows) {
                const existingDP = context.drainagePoints.find(e => e.label === row["Drainage Point"]);
                
                if (!existingDP) continue;


                constraintConditions.forEach((constraintCondition, idx) => {
                    const value = row[constraintCondition];
                    
                    context.payload.push({
                        AssetGroupId: assetGroupsStore.selectedAssetGroup.id,
                        abandonmentCondtion: constraintCondition,
                        abandonmentValue: value || null,
                        abandonmentUnit: constraintUnits[idx],
                        drainagePointId: existingDP.id
                    });
                });
            }

            var i = -1;
            for(const dialog of context.dialogs){
                i++;
                if(dialog.title == "Import Drainage-Points Constraints Data"){
                    context.dialogs[i].isVisible = true;
                    break;
                }
            }
            
        },
        Cancel(){

        },
        cancelDialog(payload){
            const context = this;
            var i = -1;
            for(const dialog of context.dialogs){
                i++;
                if(dialog.title === payload){
                    context.dialogs[i].isVisible = false;
                    break;
                }
            }
        },
        setWorkSheetColumns(){
            var context = this;
            const qSelect = { label: "", value: "", type: "text", 
                            list: [], actionName: "referedByAction", visible: true }

            console.log("context.appVariables: ", context.appVariables)
            qSelect.list = context.appVariables.map((row) => {
                return {
                    type: row.title,
                    value: row.title,
                    label: row.title,
                    variableName:row.name,
                }
            })
            for(let i = 0; i < context.appVariables.length; i++){
                context.applicationColumns.push({...qSelect})
                context.applicationColumns[i].id = `Application Column ${i+1}`;
                context.applicationColumns[i].value =  context.applicationColumns[i].list[i].value;
                context.applicationColumns[i].sn = i;
            }
            console.log("context.applicationColumns: ", context.applicationColumns)
        },
        async storeDpConstraints() {
            var context = this;
            

            console.log("context.payload: ", context.payload);
            await createBulkConstraints(context.payload)
            context.dialogs[0].isVisible = false;
            context.dialogs[1].isVisible = true;
            context.isImportComplete = true;
            
        },
        cancelImportAction(){
            console.log("cancelImportAction called")
            this.$emit("cancelImportAction")
        },
        okDialog(payload){
            console.log("payload: ", payload)
            const context = this;
            var i = -1;
            for(const dialog of context.dialogs){
                i++;
                if(dialog.title === payload){
                    switch(payload){
                        case "Import Drainage-Points Constraints Data":
                            context.storeDpConstraints();
                            context.dialogs[i].isVisible = false;
                            break;
                        case "Success":
                            context.dialogs[i].isVisible = false;
                            context.isImportComplete = true;
                            break;
                    }
                    break;
                }
            }
        },
        loadDrainagePoints() {
            var context = this;
            context.drainagePoints = assetsExplorerStore.listItems.map((row) => {
                return {
                    id: row.id,
                    label: row.label
                };
            })

            //console.log("drainagePoints: ", context.drainagePoints)
        }
    },
    created() {
        var context = this;
        context.isImportComplete = false;
        authStore.setStateData("showSpinner", false);
        context.setWorkSheetColumns();
        authStore.setStateData("isError", false);
        authStore.setStateData("errorMessages", "");
        authStore.setStateData("pageTitle", "Import Drainage-Points Constraints"); 
        propertyGridStore.SetIsPropertyGridActivated(false);
        assetsExplorerStore.SetIsAssetsExplorerActivated(true);
        context.loadDrainagePoints();
    }
}
</script>