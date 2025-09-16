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

import MessageBox from "../../../components/dialogs/MessageBox.vue";
import ExcelImport from "../../../components/DataImport/excel_import/excel-import-new-main.vue";
import { useAuthStore } from 'src/store/modules/authStore';
import { subSurfaceAssetsHeaders, dialogsWellsImport } from "./view_models/import_subsurface_assets_vm";
import { usePropertyGridStore } from 'src/store/modules/propertyGridStore';
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';
import { useAssetGroupsStore } from 'src/store/modules/assetGroupsStore';
import { useRouter } from 'vue-router'
import { fetchAssets, createAssets } from "src/api_services/assets_service";

const authStore = useAuthStore();
const router = useRouter();
const propertyGridStore = usePropertyGridStore();
const assetsExplorerStore = useAssetsExplorerStore();
const assetGroupsStore = useAssetGroupsStore();


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
            title: "Import Subsurface Asset Names",
            appVariables: subSurfaceAssetsHeaders,
            applicationColumns: [],
            dialogs: dialogsWellsImport,
            tableRows: [],
            isImportComplete: false,
            productionHistoryCollection: [],
            payload: {
                wells: [],
                reservoirs: [],
                fields: [],
                productionStrings: [],
                wellProductionStrings: []
            }
        }
    },
    methods:{
        Create(tableRows){
            const context = this;
            context.tableRows = tableRows;

            console.log(context.assetGroups);
            console.log(context.selectedAssetGroup);

            const selectedAssetGroup = context.assetGroups.find(assetGroup => assetGroup.name = context.selectedAssetGroup.assetGroupName);
            
            context.payload.AssetGroupId = selectedAssetGroup.id;

            for(const row of tableRows){
                if(row["Field"]) context.payload.fields.push({name: row["Field"], description: row["Field"]});
                if(row["Reservoir"]) context.payload.reservoirs.push({name: row["Reservoir"], description: row["Reservoir"]});
                if(row["Well"]) context.payload.wells.push({ name: row["Well"], description: row["Well"]});
                if(row["String"]) context.payload.productionStrings.push({name: row["String"], description: row["String"]});
                if(row["WellString"]) context.payload.wellProductionStrings.push({name: row["WellString"], description: row["WellString"]});
            }

            var i = -1;
            for(const dialog of context.dialogs){
                i++;
                if(dialog.title == "Import Subsurface Asset Names"){
                    context.dialogs[i].isVisible = true;
                    break;
                }
            }

            //let unique = x.filter((item, index) => x.indexOf(item) === index);

            // context.payload.fields =  context.payload.fields.filter((item, index) => context.payload.fields.indexOf(item) === index);
            // context.payload.reservoirs =  context.payload.reservoirs.filter((item, index) => context.payload.reservoirs.indexOf(item) === index);
            // context.payload.wells =  context.payload.wells.filter((item, index) => context.payload.wells.indexOf(item) === index);
            // context.payload.productionStrings =  context.payload.productionStrings.filter((item, index) => context.payload.productionStrings.indexOf(item) === index);
            // context.payload.wellProductionStrings =  context.payload.wellProductionStrings.filter((item, index) => context.payload.wellProductionStrings.indexOf(item) === index);



            // console.log("context.tableRows: ", context.tableRows)
            // console.log("context.payload: ", context.payload);

            


            //router.push('/drilling-well-schematics')
            //this.$router.push('/drilling-well-schematics')

            
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
        async storeAssets() {
            var context = this;
            //context.productionHistoryCollection = [];
            // for(const row of context.tableRows) {
            //     const newRow = {}
            //     for (const appVariable of context.appVariables){
            //        newRow[`${appVariable.name}`] = row[`${appVariable.title}`];
            //     }
            // }

            //this.$emit("doneImportAction", context.productionHistoryCollection);

            console.log("context.payload: ", context.payload);
            await createAssets(context.payload)
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
                        case "Import Subsurface Asset Names":
                            context.storeAssets();
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
        async getAssets() {
            const assets = await fetchAssets();
            console.log("assets: ", assets);
            // assetsExplorerStore.setStateData("listItems", assetGroups.map((row=>({
            // ...row,
            // label: row.name,
            // checked: false
            // }))));
        }
    },
    async created() {
        var context = this;
        context.isImportComplete = false;
        authStore.setStateData("showSpinner", false);
        context.setWorkSheetColumns();
        authStore.setStateData("isError", false);
        authStore.setStateData("errorMessages", "");
        authStore.setStateData("pageTitle", "Import Well Names"); 
        propertyGridStore.SetIsPropertyGridActivated(false);
        assetsExplorerStore.SetIsAssetsExplorerActivated(true);
        await context.getAssets();
    }
}
</script>