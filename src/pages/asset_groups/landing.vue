<template>
  <q-page class="asset-groups-page">
    <toolbox :buttons="toolboxButtons" />

    <div class="page-container">
      <div class="row q-col-gutter-lg">
        <!-- SETUP Section -->
        <div class="col-12">
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
                  type="text"
                  stack-label
                  bg-color="card-bg"
                  color="secondary"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>

      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { usePropertyGridStore } from 'src/store/modules/propertyGridStore';
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';
import { useAssetGroupsStore } from 'src/store/modules/assetGroupsStore';
import { fetchAssetGroups } from 'src/api_services/asset_groups';
import Toolbox from 'src/components/headers/CustomToolBox.vue';


export default {
  components: {
    Toolbox
  },
  setup() {
    const propertyGridStore = usePropertyGridStore();
    const assetsExplorerStore = useAssetsExplorerStore();
    const assetGroupsStore = useAssetGroupsStore();
    

    // Methods
    const saveData = () => {
      // Save logic
      console.log('Save data')
    }

    const cancelChanges = () => {
      // Cancel logic
      console.log('Cancel changes')
    }

    const printData = () => {
      // Print logic
      console.log('Print data')
    }

    // Toolbox buttons
    const toolboxButtons = ref([
      {
        icon: 'save',
        tooltip: 'Save',
        handler: saveData,
        class: 'text-secondary'
      },
      {
        icon: 'cancel',
        tooltip: 'Cancel',
        handler: cancelChanges,
        class: 'text-secondary'
      }
    ])

    // Lifecycle hook
    onMounted(() => {

      try {
        propertyGridStore.SetIsPropertyGridActivated(false)
        assetsExplorerStore.SetIsAssetsExplorerActivated(true)
      } catch (error) {
        console.error('Store initialization error:', error)
      }

        const assetGroups = fetchAssetGroups();
        assetGroupsStore.setStateData("assetGroups", assetGroups);
        assetsExplorerStore.setStateData("listItems", assetGroups.map((row=>({
        label: row.name,
        description: row.description,
        checked: false
        }))));
    })
    
    // Computed property
    const items = computed(() => assetsExplorerStore.listItems)
    const selectedAssetGroup = computed(() => assetGroupsStore.selectedAssetGroup)

    return {
      // TOOLBOX
      toolboxButtons,
      
      // Computed
      items,
      selectedAssetGroup,

      // Methods
      saveData,
      cancelChanges,
      printData
    }
  }
}
</script>

<style lang="scss">
.asset-groups-page {
  background-color: $primary;
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