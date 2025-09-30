<template>
  <NetworkVisualization />
</template>

<script>
import NetworkVisualization from '../../components/networks/custom_network6.vue';
import { usePropertyGridStore } from 'src/store/modules/propertyGridStore';
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';

const propertyGridStore = usePropertyGridStore();
const assetsExplorerStore = useAssetsExplorerStore();

export default {
  name: 'NetworkDiagram',
  computed() {

  },
  components: {
    NetworkVisualization
  },
  created(){
    propertyGridStore.SetIsPropertyGridActivated(false);
    assetsExplorerStore.SetIsAssetsExplorerActivated(true);
    assetsExplorerStore.setIsAssetCategorySelector(true);
    assetsExplorerStore.setStateData("isCheckBoxActive", true);
  }
};
</script>