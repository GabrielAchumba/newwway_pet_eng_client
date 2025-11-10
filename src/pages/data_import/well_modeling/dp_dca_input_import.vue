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
import { dpDCAInputHeaders, dialogsDpDCAInputImport } from "./view_models/dp_dca_input_vm";
import { usePropertyGridStore } from 'src/store/modules/propertyGridStore';
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';
import { useAssetGroupsStore } from 'src/store/modules/assetGroupsStore';
import { useRouter } from 'vue-router'
import { createBulkDCAInput } from "src/api_services/drainage_point_input";
import { DECLINEMETHODS } from "src/constants/asset_models";
import { 
    unitNamesRecord,
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
            title: "Import Drainage-Points DCA Data",
            appVariables: dpDCAInputHeaders,
            applicationColumns: [],
            dialogs: dialogsDpDCAInputImport,
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
                   initialCumProd: null,
                    ultimateRecovery: null,
                    plateauPeriod: 0,
                    selectedDeclineMethod: null,
                    rateDeclineRate: null,
                    gasFractionDeclineRate: null,
                    waterFractionDeclineRate: null,
                    AssetGroupId: assetGroupsStore.selectedAssetGroup.id,
                    drainagePointId: 0
                };

                const existingDP = context.drainagePoints.find(e => e.label === row[DrainagePoint]);

                if(existingDP){

                    let fluidType = "oil";
                    if(row[FluidType]) {
                        if(row[FluidType].toLowerCase() === "gas") fluidType = "gas";
                    }

                    if(fluidType === "oil"){
                        if(row[CumulativeOilProduction]) newRow.initialCumProd = Number(row[CumulativeOilProduction]);
                        if(row[UltimateOilRecovery]) newRow.ultimateRecovery = Number(row[UltimateOilRecovery]);
                    }else{
                        if(row[CumulativeGasProduction]) newRow.initialCumProd = Number(row[CumulativeGasProduction]);
                        if(row[UltimateGasRecovery]) newRow.ultimateRecovery = Number(row[UltimateGasRecovery]);
                    }

                    if(row[PlateauPeriod]) newRow.plateauPeriod = Number(row[PlateauPeriod]);
                    if(row[DeclineRate]) newRow.rateDeclineRate = Number(row[DeclineRate]);

                    if(fluidType === "oil"){
                        newRow.gasFractionDeclineRate = row[GORRateofChange] ? Number(row[GORRateofChange]) : null;
                    }else{
                        newRow.gasFractionDeclineRate = row[CGRRateofChange] ? Number(row[CGRRateofChange]) : null;
                    }

                    if(fluidType === "oil"){
                        newRow.waterFractionDeclineRate = row[WatercutRateofChange] ? Number(row[WatercutRateofChange]) : null;
                    }else{
                        newRow.waterFractionDeclineRate = row[WGRRateofChange] ? Number(row[WGRRateofChange]) : null;
                    }

                    if(row[DCAMethod]) {
                        const declineMethod = DECLINEMETHODS.find(e => e.label.toLowerCase() == row[DCAMethod].toLowerCase());
                        if(declineMethod) newRow.selectedDeclineMethod = declineMethod.id;
                        else newRow.selectedDeclineMethod = 1;
                    }
                    
                    newRow.drainagePointId = existingDP.id;
                    context.payload.tableRows.push({...newRow});
                }
            }

            console.log("context.payload: ", context.payload)

            var i = -1;
            for(const dialog of context.dialogs){
                i++;
                if(dialog.title == "Import Drainage-Points DCA Data"){
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
        async storeDpDCAData() {
            var context = this;
            

            console.log("context.payload: ", context.payload);
            await createBulkDCAInput(context.payload)
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
                        case "Import Drainage-Points DCA Data":
                            context.storeDpDCAData();
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
        authStore.setStateData("pageTitle", "Import Drainage-Points DCA Data"); 
        propertyGridStore.SetIsPropertyGridActivated(false);
        assetsExplorerStore.SetIsAssetsExplorerActivated(true);
        context.loadDrainagePoints();
    }
}
</script>