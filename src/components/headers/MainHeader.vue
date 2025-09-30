<template>
  <q-header elevated class="bg-white text-black q-px-md q-py-sm">
    <div class="row items-center justify-between">

      <!-- Left Side: Menu Icon + Page Title -->
      <div class="row items-center q-gutter-md">
        <q-btn
          flat
          round
          dense
          icon="menu"
          @click="onMenuClick"
          class="text-secondary"
        />
        
        <div class="text-h6 text-weight-medium text-secondary">
          {{ assetExplorerTitle }}
        </div>
      </div>

      <!-- Left: Menu Icon -->
      <!-- <q-btn
        flat
        round
        dense
        icon="menu"
        @click="onMenuClick"
        class="text-secondary"
      /> -->

      <!-- Right: User Info & Drawer Toggle -->
      <div class="row items-center q-gutter-sm">

        <!-- User Avatar -->
        <q-avatar size="40px">
          <img :src="userImage" alt="User" />
        </q-avatar>

        <!-- Name and Title -->
        <div class="column items-end">
          <div class="text-subtitle2 text-grey-9">Gabriel</div>
          <div class="text-caption text-grey">Reservoir Engineer</div>
        </div>

        <!-- Profile Initials Box -->
        <!-- <div
          class="bg-secondary text-white flex items-center justify-center q-pa-sm"
          style="width: 40px; height: 40px; border-radius: 8px;"
        >
          RE
        </div> -->

        <!-- Small Drawer Toggle Icon -->
        <q-btn
          round
          dense
          size="sm"
          icon="chevron_left"
          class="bg-secondary text-white"
          @click="onRightDrawerToggle"
        />
      </div>
    </div>
  </q-header>
</template>

<script setup>
import { ref, computed} from 'vue'
import userImage from 'src/assets/images/user.JPG'
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';
import { useAssetGroupsStore } from 'src/store/modules/assetGroupsStore';

const assetsExplorerStore = useAssetsExplorerStore();
const assetGroupsStore = useAssetGroupsStore();

const assetExplorerTitle = computed(() => {

  return `${assetGroupsStore.selectedAssetGroup.assetGroupName} - ${assetsExplorerStore.assetExplorerTitle}`;
});

// Emit click event
const emit = defineEmits(['menu-click', 'right-drawer-toggle'])

const onMenuClick = () => emit('menu-click')
const onRightDrawerToggle = () => emit('right-drawer-toggle')
</script>

<style scoped>
.drawer-toggle-btn {
  position: absolute;
  bottom: 8px;
  right: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}
</style>