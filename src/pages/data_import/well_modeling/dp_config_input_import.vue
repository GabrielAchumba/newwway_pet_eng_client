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
import { dpConfigHeaders, dialogsDpConfigImport } from "./view_models/dp_config_vm";
import { usePropertyGridStore } from 'src/store/modules/propertyGridStore';
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';
import { useAssetGroupsStore } from 'src/store/modules/assetGroupsStore';
import { useRouter } from 'vue-router'
import { createBulfConfigInput } from "src/api_services/drainage_point_input";
import { WELLMODELS, FLUIDTYPES, WELLTYPES } from "src/constants/asset_models";

import {
    unitNamesRecord,
    DrainagePoint,
    WellModel,
    OnstreamDate,
    WellType,
    FluidType
} from "../../../units_quantities/unitNames";

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
            title: "Import Drainage-Points Config Data",
            appVariables: dpConfigHeaders,
            applicationColumns: [],
            dialogs: dialogsDpConfigImport,
            tableRows: [],
            tableColumnUnits: [],
            isImportComplete: false,
            productionHistoryCollection: [],
            payload: {
               tableColumnUnits: [],
               tableRows: []
            },
            drainagePoints: []
        }
    },
    methods:{
        Create(payload){
            const context = this;
            context.tableRows = payload.tableRows;
            context.tableColumnUnits = payload.tableColumnUnits;

            console.log(context.assetGroups);
            console.log(context.selectedAssetGroup);
            console.log(payload.tableRows);
            console.log(payload.tableColumnUnits);

            context.payload = {
            tableColumnUnits: [...payload.tableColumnUnits],
            tableRows: []
            };

            for(const row of payload.tableRows){
                let newRow = {
                    dpName: null,
                    selectedWellModel: 0,
                    onStreamDate: new Date().toISOString().split('T')[0],
                    selectedFluidType: 0,
                    selectedWellType: 0,
                    AssetGroupId: assetGroupsStore.selectedAssetGroup.id,
                    drainagePointId: 0
                };

                const existingDP = context.drainagePoints.find(e => e.label === row[DrainagePoint]);

                if(existingDP){
                
                    if(row[DrainagePoint]) newRow.dpName = row[DrainagePoint];
                    
                    if(row[WellModel]) {
                        const wellModel = WELLMODELS.find(e => e.label.toLowerCase() == row[WellModel].toLowerCase());
                        if(wellModel) newRow.selectedWellModel = wellModel.id;
                    }
                    
                    if(row[OnstreamDate]){
                        if(row[OnstreamDate] instanceof Date){
                            newRow.onStreamDate = row[OnstreamDate].toISOString().split('T')[0];
                        } else {
                            const date = new Date(row[OnstreamDate]);
                            if(!isNaN(date.getTime())) {
                                newRow.onStreamDate = date.toISOString().split('T')[0];
                            }
                        }
                    }
                    
                    if(row[FluidType]) {
                        const fluidType = FLUIDTYPES.find(e => e.label.toLowerCase() == row[FluidType].toLowerCase());
                        if(fluidType) newRow.selectedFluidType = fluidType.id;
                    }
                    
                    if(row[WellType]) {
                        const wellType = WELLTYPES.find(e => e.label.toLowerCase() == row[WellType].toLowerCase());
                        if(wellType) newRow.selectedWellType = wellType.id;
                    }
                    
                    newRow.drainagePointId = existingDP.id;
                    context.payload.tableRows.push({...newRow});
                }
            }

            var i = -1;
            for(const dialog of context.dialogs){
                i++;
                if(dialog.title == "Import Drainage-Points Config Data"){
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
          
            const applicationColumnsTemp = [];
            console.log("unitNamesRecord: ", unitNamesRecord)
            for(let i = 0; i < context.appVariables.length; i++){
                applicationColumnsTemp.push({...qSelect})
                applicationColumnsTemp[i].id = `Application Column ${i+1}`;
                applicationColumnsTemp[i].value =  applicationColumnsTemp[i].list[i].value;
                applicationColumnsTemp[i].sn = i;
                applicationColumnsTemp[i].unitOptions = unitNamesRecord[context.appVariables[i].name].inputOptions;
            }

            context.applicationColumns = [...applicationColumnsTemp];
            console.log("context.applicationColumns: ", context.applicationColumns)
        },
        async storeDpConfigs() {
            var context = this;
            

            console.log("context.payload: ", context.payload);
            await createBulfConfigInput(context.payload)
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
                        case "Import Drainage-Points Config Data":
                            context.storeDpConfigs();
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
        authStore.setStateData("pageTitle", "Import Drainage-Points Configurations"); 
        propertyGridStore.SetIsPropertyGridActivated(false);
        assetsExplorerStore.SetIsAssetsExplorerActivated(true);
        context.loadDrainagePoints();
    }
}
</script>