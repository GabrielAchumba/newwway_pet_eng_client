<template>

  <SubsurfaceNetwork
  :isStoredNetwork="isStoredNetwork"
  :showSurfaceAssets="showSurfaceAssets"/>

</template>

<script>
import SubsurfaceNetwork from '../../components/networks/subsurface_network.vue';
import { usePropertyGridStore } from 'src/store/modules/propertyGridStore';
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';

const propertyGridStore = usePropertyGridStore();
const assetsExplorerStore = useAssetsExplorerStore();

export default {
  name: 'StoredNetwork',
  computed() {

  },
  data(){
    return {
        isStoredNetwork: true,
        showSurfaceAssets: true,
    }
  },
  components: {
    SubsurfaceNetwork,
  },
  created(){
    propertyGridStore.SetIsPropertyGridActivated(false);
    assetsExplorerStore.SetIsAssetsExplorerActivated(true);
    assetsExplorerStore.setIsAssetCategorySelector(false);
    assetsExplorerStore.setStateData("isCheckBoxActive", false);
    assetsExplorerStore.setStateData("assetExplorerTitle", 'Stored Networks'); 

  }
};
</script>