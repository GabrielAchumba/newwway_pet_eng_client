<template>
  <div class="toolbox-pane" style="scrollbar-width: none; height: 100vh;">

    <div class="row items-center justify-between q-pa-sm">
        <!-- Toolbox on the right -->
        <div class="toolbox row items-center q-gutter-sm">
            <q-btn flat round icon="add" size="sm" @click="onAdd">
              <q-tooltip>
                Add
              </q-tooltip>
            </q-btn>
            <q-btn flat round icon="upload" size="sm" @click="onImport" >
              <q-tooltip>
                import
              </q-tooltip>

            </q-btn>
            <q-btn flat round icon="arrow_back" size="sm" @click="onNetwork" >          
              <q-tooltip>
                Previous
              </q-tooltip>
            </q-btn>
            <q-btn flat round icon="delete" size="sm" color="negative" @click="onDelete" >    
              <q-tooltip>
                Delete
              </q-tooltip>
            </q-btn>
        </div>
    </div>

    <!-- Category Dropdown -->
    <div class="q-pa-sm">
      <q-select
        v-if="isAssetCategorySelector"
        v-model="selectedCategory"
        :options="categories"
        label="Select Category"
        outlined
        dense
        rounded
        emit-value
        map-options
        class="full-width"
        @update:model-value="onAssetCategoryChanged"
        :disable="assetCategorySelectorReadOnly"
      />
    </div>


    <!-- Listbox -->
    <div class="listbox">
      <q-list bordered separator>
        <q-item v-for="(item, index) in listItems" 
        :key="index" 
        clickable
        @click="selectItem(index)"
        :class="{ 'selected-item': selectedIndex === index }"
        >
          <q-item-section avatar v-if="isCheckBoxActive">
            <q-checkbox v-model="item.checked" color="secondary" dense 
            @click.stop
            @update:model-value="onCheckboxChanged" />
          </q-item-section>
          <q-item-section>
            {{ item.label }}
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';
import { useAssetGroupsStore } from 'src/store/modules/assetGroupsStore';
import { fetchAssetsByCategory, generateNetwork } from 'src/api_services/assets_service';
import { fetchAssetGroups } from 'src/api_services/asset_groups';
import { findLiftCurvesNamesPerDrainagePoint } from 'src/api_services/well_modeling';
import { fetchStoredNetworks, drawStoredAssetsNetwork } from '../../api_services/network_service';
import { 
  getSurfaceNodes,
  getConnections
} from 'src/app_utils/visualizations/draw_network';

const assetsExplorerStore = useAssetsExplorerStore();
const assetGroupsStore = useAssetGroupsStore();
const router = useRouter();
const route = useRoute();


const { assetExplorerTitle, listItems, isCheckBoxActive, isAssetCategorySelector } = storeToRefs(assetsExplorerStore);


const selectedIndex = ref(null);
const assetCategorySelectorReadOnly = ref(false);

// --- Dropdown logic ---
const categories = ref([
  { label: 'Drainage Points', value: 'drainagePoints' },
  { label: 'Wells', value: 'wells' },
  { label: 'Reservoirs', value: 'reservoirs' },
  { label: 'Fields', value: 'fields' },
  { label: 'Facilities', value: 'facilities' },
  // { label: 'Central Processing Facilities', value: 'cpfs' },
  // { label: 'Pipelines', value: 'pipelines' },
  // { label: 'Dehydration Unit', value: 'dehydrationUnit' },
  // { label: 'Gas Customer', value: 'gasCustomer' },
  // { label: 'FCOT', value: 'fcot' }
])

const selectedCategory = ref('wells')

async function getLiftCurvesNamesPerDrainagePoint() {

      const assetGroupId = assetGroupsStore.selectedAssetGroup.id;
      console.log("assetGroupId: ", assetGroupId);
      const drainagePointId = assetGroupsStore.activeDrainagePoint.id;
      console.log("drainagePointId: ", drainagePointId);

      const payload = {
          drainagePointId,
          assetGroupId,
      }
      const liftCurvesNames = await findLiftCurvesNamesPerDrainagePoint(payload);
      console.log("liftCurvesNames: ", liftCurvesNames);

  }


async function selectItem(index) {
 
  selectedIndex.value = index
  
  switch(router.currentRoute._value.fullPath){
    case '/asset-groups':
      assetGroupsStore.setStateData("selectedAssetGroup", {
        assetGroupName: listItems.value[index].label,
        assetGroupDescription: listItems.value[index].description,
        id: listItems.value[index].id,
      });
      break;
    case '/well-lift-curves-landing':
      assetGroupsStore.setStateData("activeDrainagePoint", {
        assetGroupName: listItems.value[index].label,
        assetGroupDescription: listItems.value[index].description,
        id: listItems.value[index].id,
      });

      //await getLiftCurvesNamesPerDrainagePoint();
      break;
    case '/lift-curves-import':
      assetGroupsStore.setStateData("activeDrainagePoint", {
        assetGroupName: listItems.value[index].label,
        assetGroupDescription: listItems.value[index].description,
        id: listItems.value[index].id,
      });
      break;
    case '/drainage-point-config-landing':
      assetGroupsStore.setStateData("activeDrainagePoint", {
        assetGroupName: listItems.value[index].label,
        assetGroupDescription: listItems.value[index].description,
        id: listItems.value[index].id,
      });
      break;
    case '/drainage-point-constraints-landing':
      assetGroupsStore.setStateData("activeDrainagePoint", {
        assetGroupName: listItems.value[index].label,
        assetGroupDescription: listItems.value[index].description,
        id: listItems.value[index].id,
      });
      break;
    case '/drainage-point-dca-input-landing':
      assetGroupsStore.setStateData("activeDrainagePoint", {
        assetGroupName: listItems.value[index].label,
        assetGroupDescription: listItems.value[index].description,
        id: listItems.value[index].id,
      });
      break;
    case '/stored-networks':
      const selectedAssetGroupId = assetGroupsStore.selectedAssetGroup.id;
      const networkName = listItems.value[index].label;
      await drawStoredNetwork(selectedAssetGroupId, networkName);
      break;
  }
}

async function drawStoredNetwork(selectedAssetGroupId, networkName) {
  
      console.log("networkName: ", networkName);
      console.log("selectedAssetGroupId: ", selectedAssetGroupId);
      const networkResponse  = await drawStoredAssetsNetwork(selectedAssetGroupId, networkName);
      console.log("networkResponse: ", networkResponse)

      //if(networkResponse.status === 200 || networkResponse.status === 201) {

      const { equipmentConnections, equipmentNameImages } = networkResponse;

      const surfaceNodes = getSurfaceNodes(equipmentConnections, equipmentNameImages);

      const connections = getConnections(equipmentConnections);

      console.log("surfaceNodes: ", surfaceNodes);
      console.log("connections: ", connections);
      

      assetsExplorerStore.setStateData("networkNodes", surfaceNodes);
      assetsExplorerStore.setStateData("networkConnections", connections);
      assetsExplorerStore.setStateData("activeNetworkPayload", payload);

    //}
}

function onAssetCategoryChanged(_selectedCategory) {

  const selectedAssetGroupId = assetGroupsStore.selectedAssetGroup.id;

  fetchAssets(_selectedCategory, selectedAssetGroupId);
}

async function onCheckboxChanged() {

  const selected = listItems.value.filter(item => item.checked);
  console.log('Selected items:', selected);

  if(selected.length > 0){

    const AssetGroupId = selected[0].AssetGroupId;
    const payload = {
      AssetGroupId,
      assetCategory: selectedCategory.value,
      assets: selected.map((row) => {
        return {
          id: row.id,
          name: row.name
        }
      })
    }

    const networkResponse = await generateNetwork(payload);
    
    if(networkResponse.status === 200 || networkResponse.status === 201) {

      const { equipmentConnections, equipmentNameImages } = networkResponse.data;

      const surfaceNodes = getSurfaceNodes(equipmentConnections, equipmentNameImages);

      const connections = getConnections(equipmentConnections);

      console.log("surfaceNodes: ", surfaceNodes);
      console.log("connections: ", connections);
      

      assetsExplorerStore.setStateData("networkNodes", surfaceNodes);
      assetsExplorerStore.setStateData("networkConnections", connections);
      assetsExplorerStore.setStateData("activeNetworkPayload", payload);

    }

  }else{
    assetsExplorerStore.setStateData("networkNodes", []);
    assetsExplorerStore.setStateData("networkConnections", []);
  }
  

}

function onAdd() {
  
  switch(router.currentRoute._value.fullPath){
    case '/asset-groups':

      assetGroupsStore.setStateData("selectedAssetGroup", {
        assetGroupName: "",
        assetGroupDescription: ""
      });
      break;
  }
}

function onImport() {

   switch(router.currentRoute._value.fullPath){
    case '/subsurface-assets-landing':
      router.push('/import-subsurface-assets');
      break;
    case '/well-lift-curves-landing':
      router.push('/lift-curves-import');
      break;
    case '/drainage-point-config-landing':
      router.push('/drainage-point-config-import');
      break;
    case '/drainage-point-constraints-landing':
      router.push('/drainage-point-constraints-import');
      break;
    case '/drainage-point-dca-input-landing':
      router.push('/drainage-point-dca-input-import');
      break;
  }
}

function onNetwork() {

   switch(router.currentRoute._value.fullPath){
    case '/subsurface-assets-landing':
      router.push('/network-diagram')
      break;
    case '/import-subsurface-assets':
      router.push('/subsurface-assets-landing')
      break;
    case '/lift-curves-import':
      router.push('/well-lift-curves-landing');
      break;
    case '/drainage-point-config-import':
      router.push('/drainage-point-config-landing');
      break;
    case '/drainage-point-constraints-import':
      router.push('/drainage-point-constraints-landing');
      break;
    case '/drainage-point-dca-input-import':
      router.push('/drainage-point-dca-input-landing');
      break;
  }
}

function onDelete() {
  //items.value = items.value.filter(item => !item.checked)
}

async function fetchAssets(_selectedCategory, selectedAssetGroupId) {

  const assets = await fetchAssetsByCategory(_selectedCategory, selectedAssetGroupId);
  //console.log(assets);
  assetsExplorerStore.setStateData("listItems", assets.map((row=>({
            ...row,
            label: row.name,
            checked: false
            }))));

  if(listItems.value.length > 0){

    const index = 0;

    switch(_selectedCategory) {
      case "drainagePoints":
        assetGroupsStore.setStateData("activeDrainagePoint", {
          assetGroupName: listItems.value[index].label,
          assetGroupDescription: listItems.value[index].description,
          id: listItems.value[index].id,
        });
        break;
    }
  }

}

async function getAssetGroups() {
    console.log("getAssetGroups")
    const assetGroups = await fetchAssetGroups();
    console.log(assetGroups)
    assetGroupsStore.setStateData("assetGroups", assetGroups);
    assetsExplorerStore.setStateData("listItems", assetGroups.map((row=>({
    ...row,
    label: row.name,
    checked: false
    }))));


  }

  async function fetchListItems() {

    console.log("assetGroupsStore.selectedAssetGroup: ", assetGroupsStore.selectedAssetGroup);

    const selectedAssetGroupId = assetGroupsStore.selectedAssetGroup.id;
  
    console.log(router.currentRoute._value.fullPath)
    switch(router.currentRoute._value.fullPath){
      case '/asset-groups':
        getAssetGroups();
        break;
      case '/subsurface-assets-landing':
        fetchAssets(selectedCategory.value, selectedAssetGroupId);
        break;
      case '/well-lift-curves-landing':
        assetCategorySelectorReadOnly.value = true;
        fetchAssets('drainagePoints', selectedAssetGroupId);
        break;
      case '/drainage-point-config-landing':
        assetCategorySelectorReadOnly.value = true;
        fetchAssets('drainagePoints', selectedAssetGroupId);
        break;
      case '/drainage-point-constraints-landing':
        assetCategorySelectorReadOnly.value = true;
        fetchAssets('drainagePoints', selectedAssetGroupId);
        break;
      case '/drainage-point-dca-input-landing':
        assetCategorySelectorReadOnly.value = true;
        fetchAssets('drainagePoints', selectedAssetGroupId);
        break;
      // case '/stored-networks':
      //   assetCategorySelectorReadOnly.value = true;
      //   fetchStoredNetworks(selectedAssetGroupId);
      //   break;
    }
}

watch(listItems, (val) => {
  //console.log('listItems changed:', val)
}, { immediate: true })

watch(
    () => route.fullPath,
    async (newPath, oldPath) => {
      console.log('Route changed from:', oldPath, 'to:', newPath)
      const selectedAssetGroupId = assetGroupsStore.selectedAssetGroup.id;
      if(newPath === '/stored-networks'){
        assetCategorySelectorReadOnly.value = true;
        const response = await fetchStoredNetworks(selectedAssetGroupId);
        console.log("response: ", response)
        assetsExplorerStore.setStateData("listItems", response.map((row=>({
            ...row,
            label: row.networkName,
            checked: false
            }))));
      }
    },
    { immediate: true }
  )

onMounted(async () => {

  await fetchListItems();

})

</script>

<style scoped>
.toolbox-pane {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: 1px solid #ddd;
  background: white;
}

/* Toolbox styling */
.toolbox {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  height: 30px;
  background: white;
  /* border-bottom: 1px solid #ddd; */
  gap: 8px;
}

/* Listbox fills remaining space */
.listbox {
  /* flex: 1;
  overflow-y: auto;
  padding: 0; */
  flex: 1;
  overflow-y: auto;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  scrollbar-width: none; 
}
.listbox::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.q-list {
  background: white;
}

/* .q-item {
  transition: background-color 0.2s ease;
}
.q-item:hover {
  background-color: #f0f0f5;
} */

.q-item {
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
}
.q-item:last-child {
  border-bottom: none;
}
.q-item:hover {
  background-color: #f8faff;
}

.q-item-section[avatar] {
  min-width: 40px;
  display: flex;
  justify-content: center;
}

.selected-item {
  /*background-color: #e6f4ff !important;  Light blue highlight */
  background-color: #1976d2;
  color: white;

}

.full-width {
  width: 100%;
}


</style>