<template>
  <q-layout view="lHh Lpr lFf">
    <MainHeader @menu-click="toggleDrawer" @right-drawer-toggle="toggleRightDrawer" />

    <Sidebar 
      :expanded="leftDrawerOpen"
      :leftDrawerWidth="leftDrawerWidth"
    />

    <q-page-container class="splitter-container">
      <div class="main-content-row">
        <div
          v-if="isAssetsExplorerActivated"
          class="bg-grey-2"
          style="width: 250px; border-right: 1px solid #ccc;"
        >
          <ToolboxListPane />
        </div>
        <div class="flex-1">
          <q-splitter
            v-if="isPropertyGridActivated"
            v-model="splitterModel"
            :limits="[200, 600]"
            unit="px"
            reverse
          >
            <!-- Left Main Content -->
            <template v-slot:before>
              <div class="splitter-pane left-content">
                <!-- <div class="router-scroll"> -->
                  <router-view />
                <!-- </div> -->
              </div>
            </template>

            <!-- Right Property Grid -->
            <template v-slot:after>
              <div class="splitter-pane property-grid-panel bg-white">
                <CustomPropertyGrid />
              </div>
            </template>
          </q-splitter>
          <div 
          class="splitter-pane left-content"
          v-else>
              <router-view />
          </div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { usePropertyGridStore } from 'src/store/modules/propertyGridStore';
import MainHeader from 'components/headers/MainHeader.vue'
import Sidebar from 'components/drawers/Sidebar.vue'
import CustomPropertyGrid from 'components/properties_grid/CustomPropertyGrid.vue'
import  ToolboxListPane from 'components/explorers/ToolboxListPane.vue'
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';
import { useAssetGroupsStore } from 'src/store/modules/assetGroupsStore';
import { fetchAssetGroups } from 'src/api_services/asset_groups';

const leftDrawerOpen = ref(true)
const leftDrawerWidth = ref(120)
const splitterModel = ref(350)
const propertyGridStore = usePropertyGridStore();
const assetsExplorerStore = useAssetsExplorerStore();
const assetGroupsStore = useAssetGroupsStore();

const isPropertyGridActivated = computed(() => propertyGridStore.isPropertyGridActivated)
const isAssetsExplorerActivated = computed(() => assetsExplorerStore.isAssetsExplorerActivated)

function toggleDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
  leftDrawerWidth.value = leftDrawerOpen.value ? 120 : 40
}

function toggleRightDrawer() {
  assetsExplorerStore.toggleIsAssetsExplorerActivated();
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

  onMounted(async ()  => {

      await getAssetGroups();

  })

</script>

<style scoped>
.splitter-container {
  height: 100%;
  overflow: hidden; /* prevent parent scroll */
}

.q-page-container {
  height: 100%;
  overflow: hidden; /* prevent container scroll */
}

.q-splitter {
  height: 100%;
}

.splitter-pane {
  height: 100%;
  overflow-y: auto; /* independent scroll */
}

.left-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.router-scroll {
  flex: 1;
  overflow-y: auto; /* this makes router-view content scroll independently */
}


.property-grid-panel {
  flex: 1;
  border-left: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  overscroll-behavior: contain; /* stops scroll chaining */
}

.main-content-row {
  display: flex;
  height: 100%;
}

.main-content-row > .flex-1 {
  flex: 1;
  min-width: 0; /* important so splitter works inside flex */
}

</style>