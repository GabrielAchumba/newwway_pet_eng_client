<template>
  <q-page class="asset-groups-page">
    <Toolbox 
    :buttons="toolboxButtons"
    :toolBoxTitle="pageTitle" />

    <div class="page-container">
      <div class="row q-col-gutter-lg">
        <!-- SETUP Section -->
        <div class="col-sm-12 col-xs-12 col-md-4 col-lg-4 col-xl-4">
          <q-card class="setup-section">
            <q-card-section>
              <div class="text-caption">SELECTED ASSET GROUP</div>
            </q-card-section>
            <q-card-section class="q-gutter-y-md">        
              
              <div>
                <q-input
                  filled
                  v-model="selectedAssetGroup.assetGroupName"
                  label="Name"
                  type="text"
                  stack-label
                  bg-color="card-bg"
                  color="secondary"
                />
              </div>

               <!-- Abandonment Rate -->
              <div>
                <q-input
                  filled
                  v-model="selectedAssetGroup.assetGroupDescription"
                  label="Description"
                  type="textarea"
                  stack-label
                  bg-color="card-bg"
                  color="secondary"
                  style="height: 50vh;"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <UnitsConfig class="col-sm-12 col-xs-12 col-md-8 col-lg-8 col-xl-8"/>

        <!-- <div class="col-sm-12 col-xs-12 col-md-8 col-lg-8 col-xl-8">
          <UnitsConfig/>
        </div> -->

      </div>
    </div>


        <CustomDialog
            v-for="dialog in dialogs" 
            :key="dialog.title"
            :modelValue="dialog.isVisible"
            :title="dialog.title"
            :message="dialog.message"
            :okayEvent="dialog.okayEvent"
            :cancelEvent="dialog.cancelEvent"
            @cancelDialog="cancelDialog($event)"
            @okDialog="okDialog($event)"
            >
        </CustomDialog>

  </q-page>
</template>

<script>
import { ref, computed, onMounted, reactive  } from 'vue';
import { usePropertyGridStore } from 'src/store/modules/propertyGridStore';
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';
import { useAssetGroupsStore } from 'src/store/modules/assetGroupsStore';
import { fetchAssetGroups } from 'src/api_services/asset_groups';
import Toolbox from 'src/components/headers/CustomToolBox.vue';
import CustomDialog from "src/components/dialogs/CustomDialog.vue";
import { dialogsAssetGroupsLanding } from "./view_models/landing_vm";
import { createAssetGroup } from "src/api_services/asset_groups";
import UnitsConfig from "./units_config.vue";


export default {
  components: {
    Toolbox,
    CustomDialog,
    UnitsConfig
  },
  setup() {

    const propertyGridStore = usePropertyGridStore();
    const assetsExplorerStore = useAssetsExplorerStore();
    const assetGroupsStore = useAssetGroupsStore();

    // Computed property
    const items = computed(() => assetsExplorerStore.listItems);
    const selectedAssetGroup = computed(() => assetGroupsStore.selectedAssetGroup);
    const dialogs = ref([...dialogsAssetGroupsLanding]);
    const pageTitle = ref("Asset-group & Units")
    

    // Methods

    const setSelectedAssetGroup = () => {
        const payload = { ...selectedAssetGroup.value }
        console.log(payload)
        assetGroupsStore.setStateData("selectedAssetGroup", payload);
    }

    const storeAssetGroup = async () => {
        const payload = {
            name: selectedAssetGroup.value.assetGroupName,
            description: selectedAssetGroup.value.assetGroupDescription
        };
        const response = await createAssetGroup(payload);
        if(response.status == 200 || response.status == 201){
            await getAssetGroups();
            dialogs.value[0].isVisible = false;
            dialogs.value[1].isVisible = true;
        }else{
            dialogs.value[0].isVisible = false;
            dialogs.value[2].isVisible = true;
            dialogs.value[2].message = response.message;
        }
        console.log('response: ', response)
    }

    const saveData = () => {
      
        console.log(dialogs.value)
        let i = -1;
        for(const dialog of dialogs.value){
            i++;
            console.log(dialog.title)
            if(dialog.title == "Create Asset Group"){
                dialogs.value[i].isVisible = true;
                console.log("dialogs.value: ", dialogs.value)
                break;
            }
        }
    }

    const LoadSelectedAssetGroupData = () => {
      
        console.log(dialogs.value)
        let i = -1;
        for(const dialog of dialogs.value){
            i++;
            console.log(dialog.title)
            if(dialog.title == "Load Asset Group Data"){
                dialogs.value[i].isVisible = true;
                console.log("dialogs.value[i]: ", dialogs.value[i])
                break;
            }
        }
    }

    const cancelChanges = () => {
      // Cancel logic
      console.log('Cancel changes')
    }

    const printData = () => {
      // Print logic
      console.log('Print data')
    }

    const cancelDialog = (payload) => {
        //const context = this;
        var i = -1;
        for(const dialog of dialogs.value){
            i++;
            if(dialog.title === payload){
                dialogs.value[i].isVisible = false;
                break;
            }
        }
    }

    const okDialog = async (payload) => {
        console.log("payload: ", payload)
        //const context = this;
        var i = -1;
        for(const dialog of dialogs.value){
            i++;
            if(dialog.title === payload){
                switch(payload){
                    case "Create Asset Group":
                        await storeAssetGroup();
                        dialogs.value[i].isVisible = false;
                        break;
                    case "Load Asset Group Data":
                        await setSelectedAssetGroup();
                        dialogs.value[i].isVisible = false;
                        break;
                    case "Load Asset Group Data Success":
                        dialogs.value[i].isVisible = false;
                        break;
                    case "Success":
                        dialogs.value[i].isVisible = false;
                        break;
                }
                break;
            }
        }
    }

    const getAssetGroups = async () => {

        const assetGroups = await fetchAssetGroups();
        console.log(assetGroups)
        assetGroupsStore.setStateData("assetGroups", assetGroups);
        assetsExplorerStore.setStateData("listItems", assetGroups.map((row=>({
        ...row,
        label: row.name,
        checked: false
        }))));
    }

    // Toolbox buttons
    const toolboxButtons = ref([
      {
        icon: 'save',
        tooltip: 'Save',
        title: 'Save',
        handler: saveData,
        class: 'text-secondary',
        style: "border-right: 2px solid #0A1D3F;"
      },
      {
        icon: 'download',
        tooltip: 'Load data',
        title: 'Load data',
        handler: LoadSelectedAssetGroupData,
        class: 'text-secondary',
        style: "border-right: 2px solid #0A1D3F;"
      },
      {
        icon: 'cancel',
        tooltip: 'Cancel',
        title: 'Cancel',
        handler: cancelChanges,
        class: 'text-secondary'
      },
    ])

    // Lifecycle hook
    onMounted(async ()  => {

      try {
        propertyGridStore.SetIsPropertyGridActivated(false)
        assetsExplorerStore.SetIsAssetsExplorerActivated(true)
        assetsExplorerStore.setIsAssetCategorySelector(false) 
      } catch (error) {
        console.error('Store initialization error:', error)
      }

      //await getAssetGroups();

    })
    

    return {

      // REF
      toolboxButtons,
      dialogs,
      
      // Computed
      items,
      selectedAssetGroup,

      // Methods
      saveData,
      cancelChanges,
      printData,
      cancelDialog,
      okDialog,
      LoadSelectedAssetGroupData,
      pageTitle
    }
  }
}
</script>

<style lang="scss">
.asset-groups-page {
  background-color: #F0F4F8;
  height: 100vh;
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }

  .page-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .setup-section, .time-frequency-section {
    background-color: $primary;
    color: $forecolor1;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    height: 80vh;

    .text-caption {
      color: $secondary;
      font-weight: 600;
      border-bottom: 2px solid $secondary;
      padding-bottom: 8px;
    }
  }

  @media (max-width: $breakpoint-sm-max) {
    .setup-section {
      margin-bottom: 20px;
    }
  }
}
</style>