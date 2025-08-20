<template>
  <div class="toolbox-pane" style="scrollbar-width: none; height: 100vh;">

    <div class="row items-center justify-between q-pa-sm">
        <!-- Title on the left -->
        <!-- <div class="text-caption text-bold">{{ assetExplorerTitle }}</div> -->

        <!-- Toolbox on the right -->
        <div class="toolbox row items-center q-gutter-sm">
            <q-btn flat round icon="add" size="sm" @click="onAdd" />
            <q-btn flat round icon="upload" size="sm" @click="onImport" />
            <q-btn flat round icon="delete" size="sm" color="negative" @click="onDelete" />
        </div>
    </div>


    <!-- Listbox -->
    <div class="listbox">
      <q-list bordered separator>
        <q-item v-for="(item, index) in items" 
        :key="index" 
        clickable
        @click="selectItem(index)"
        :class="{ 'selected-item': selectedIndex === index }"
        >
          <q-item-section avatar v-if="isCheckBoxActive">
            <q-checkbox v-model="item.checked" color="secondary" dense @click.stop />
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';
import { useAssetGroupsStore } from 'src/store/modules/assetGroupsStore';

const assetsExplorerStore = useAssetsExplorerStore();
const assetGroupsStore = useAssetGroupsStore();
const router = useRouter();

const assetExplorerTitle = computed(() => assetsExplorerStore.assetExplorerTitle);
const items = computed(() => assetsExplorerStore.listItems);
const isCheckBoxActive = computed(() => assetsExplorerStore.isCheckBoxActive);


const selectedIndex = ref(null)

function selectItem(index) {
 
  selectedIndex.value = index
  
  switch(router.currentRoute._value.fullPath){
    case '/asset-groups':

      assetGroupsStore.setStateData("selectedAssetGroup", {
        assetGroupName: items.value[index].label,
        assetGroupDescription: items.value[index].description
      });
      break;
  }
}

function onAdd() {
  items.value.push({ label: `Item ${items.value.length + 1}`, checked: false })
}

function onImport() {
  console.log('Import clicked')
   router.push('/import-subsurface-assets')
}

function onDelete() {
  items.value = items.value.filter(item => !item.checked)
}
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
  background-color: #e6f4ff !important; /* Light blue highlight */
}


</style>