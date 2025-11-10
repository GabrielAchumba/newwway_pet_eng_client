<template>
  <q-page class="prediction-params-page">

    <CustomPage
    :toolbarItems="toolboxButtons"
    :dialogTitle="dialogTitle"
    :isLoading="isLoading"
    @toolBarItemClick="toolBarItemClick">
      <template v-slot:content>

        <div class="page-container">
          <div class="row q-col-gutter-lg">
            <!-- SETUP Section -->
            <div class="col-12">
              <q-card class="setup-section">
                <q-card-section>
                  <div class="text-caption">SETUP</div>
                </q-card-section>
                <q-card-section>
                    <div class="row q-col-gutter-lg">

                        <div class="col-md-4 col-sm-12">     
                          <q-select
                            :model-value="selectedNetwork"
                            option-disable="inactive"
                            :options="storedNetworks"
                            label="Network"
                            bg-color="card-bg"
                            color="secondary"
                            filled
                            option-value="id"
                            option-label="type"
                            name="type"
                            emit-value
                            map-options
                            @update:model-value="updateSelectedStoredNetwork($event)"
                          />
                        </div>
                        <!-- Prediction Start -->
                        <div class="col-md-4 col-sm-12">
                            <q-input
                            filled
                            v-model="predictionStart"
                            label="Prediction Start"
                            type="date"
                            stack-label
                            bg-color="card-bg"
                            color="secondary"
                            readonly
                            />
                        </div>
                        
                        <!-- Prediction End -->
                        <div class="col-md-4 col-sm-12">
                            <q-input
                            filled
                            v-model="predictionEnd"
                            label="Prediction End"
                            type="date"
                            stack-label
                            bg-color="card-bg"
                            color="secondary"
                            />
                        </div>
                    </div>
                </q-card-section>

              </q-card>
            </div>

          </div>

          <div class="row q-col-gutter-lg q-mt-lg">

            <!-- TIME FREQUENCY Section -->
            <div class="col-md-6 col-sm-12">
              <q-card class="time-frequency-section">
                <q-card-section>
                  <div class="text-caption">TIME FREQUENCY</div>
                </q-card-section>
                <q-card-section class="q-gutter-y-md">
                  <!-- Radio Group -->

                  <q-radio 
                    v-model="frequencyMode"
                    val="automatic" 
                    label="Automatic" 
                    color="secondary"
                  />

                  <q-radio
                    v-model="frequencyMode" 
                    val="userDefined" 
                    label="User Defined" 
                    color="secondary"
                  />

                  <q-select
                    filled
                    v-model="selectedTimeUnit"
                    :options="timeUnitOptions"
                    label="User Defined"
                    :disable="frequencyMode === 'automatic'"
                    bg-color="card-bg"
                    color="secondary"
                  />

                  <!-- User Defined Frequency -->
                  <q-input
                    filled
                    v-model="userDefinedFrequency"
                    label="User Defined Frequency"
                    type="number"
                    :readonly="frequencyMode === 'automatic'"
                    stack-label
                    bg-color="card-bg"
                    color="secondary"
                  />
                </q-card-section>
              </q-card>
            </div>

            <!-- RESULT REPORTING FREQUENCY Section -->
            <div class="col-md-6 col-sm-12">
              <q-card class="time-frequency-section">
                <q-card-section>
                  <div class="text-caption">RESULT REPORTING</div>
                </q-card-section>
                <q-card-section class="q-gutter-y-md">
                  <!-- Radio Group -->

                  <q-radio 
                    v-model="reportingFrequencyMode"
                    val="automatic" 
                    label="Automatic" 
                    color="secondary"
                  />

                  <q-radio
                    v-model="reportingFrequencyMode" 
                    val="userDefined" 
                    label="User Defined" 
                    color="secondary"
                  />

                  <q-select
                    filled
                    v-model="selectedReportingTimeUnit"
                    :options="timeUnitOptions"
                    label="User Defined"
                    :disable="reportingFrequencyMode === 'automatic'"
                    bg-color="card-bg"
                    color="secondary"
                  />

                  <!-- User Defined Frequency -->
                  <q-input
                    filled
                    v-model="userDefinedReportingFrequency"
                    label="User Defined Frequency"
                    type="number"
                    :readonly="reportingFrequencyMode === 'automatic'"
                    stack-label
                    bg-color="card-bg"
                    color="secondary"
                  />
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

    </template>
    </CustomPage>
  </q-page>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { usePropertyGridStore } from 'src/store/modules/propertyGridStore'
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore'
import { useAssetGroupsStore } from 'src/store/modules/assetGroupsStore';
import { 
  fetchStoredNetworks, 
  getEarliestOnstreamDate 
} from '../../api_services/network_service';
import CustomPage from '../../components/dialogs/custom_page.vue';
import { runForecastRequest } from '../../api_services/forecast_service';


export default {
  components: {
    CustomPage
  },
  setup() {
    const propertyGridStore = usePropertyGridStore()
    const assetsExplorerStore = useAssetsExplorerStore()
    const assetGroupsStore = useAssetGroupsStore();
    const storedNetworks = ref([]);
    const selectedNetwork = ref(null);

    const dialogTitle = ref("Setup Parameters and Run Forecast");
    const isLoading = ref(false);
    
    // SETUP section data
    const predictionStart = ref('')
    const predictionEnd = ref('')
    
    // TIME FREQUENCY section data
    const frequencyMode = ref('automatic')
    const selectedTimeUnit = ref('month')
    const userDefinedFrequency = ref(1)
    const timeUnitOptions = ['day', 'month', 'year']

     // REPORTING FREQUENCY section data
    const reportingFrequencyMode = ref('automatic')
    const selectedReportingTimeUnit = ref('month')
    const userDefinedReportingFrequency = ref(1);

    

    const updateSelectedStoredNetwork = async (value) => {

      selectedNetwork.value = value;
      isLoading.value = true;
      const selectedAssetGroupId = assetGroupsStore.selectedAssetGroup.id;
      const _selectedNetwork = storedNetworks.value.find(e => e.id = selectedNetwork.value);
      const networkName = _selectedNetwork.networkName;
      await fetchEarliestOnstreamDate(selectedAssetGroupId, networkName);
      isLoading.value = false;

    }

    async function fetchEarliestOnstreamDate(selectedAssetGroupId, networkName) {

          const response  = await getEarliestOnstreamDate(selectedAssetGroupId, networkName);
          if(response.status == 200 || response.status == 201){
            predictionStart.value = new Date(response.data).toISOString().split('T')[0];
          }

    }

    // Methods
    const runForecast = async () => {
      
      const _selectedNetwork = storedNetworks.value.find(e => e.id = selectedNetwork.value);
      const networkName = _selectedNetwork.networkName;
      const selectedAssetGroupId = assetGroupsStore.selectedAssetGroup.id;

      const payload = {
        predictionStart: predictionStart.value,
        predictionEnd: predictionEnd.value,
        networkName: networkName,
        AssetGroupId: selectedAssetGroupId,
        frequencyMode: frequencyMode.value,
        selectedTimeUnit: selectedTimeUnit.value,
        userDefinedFrequency: userDefinedFrequency.value,
        reportingFrequencyMode: reportingFrequencyMode.value,
        selectedReportingTimeUnit: selectedReportingTimeUnit.value,
        userDefinedReportingFrequency: userDefinedReportingFrequency.value
      }
      console.log('runFoecast payload: ', payload);

      const response = await runForecastRequest(payload);
    }

    // Toolbox buttons
    const toolboxButtons = ref([
      {
        id: 'Run',
        icon: 'play',
        title: 'Run',
        title2: 'Run Forecast',
      },
    ])

    const fetchStoredNetworksByAssetGroup = async () => {
      
      const selectedAssetGroupId = assetGroupsStore.selectedAssetGroup.id;
      isLoading.value = true;
      const response = await fetchStoredNetworks(selectedAssetGroupId);
      isLoading.value = false;
      console.log("response: ", response)
      storedNetworks.value = response.map((row, idx) => {
        return {
            sn: idx + 1,
            variable: row.networkName,
            value: row.networkName,
            label: row.networkName,
            type: row.networkName,
            ...row,
        };
      })
      
    }

    const toolBarItemClick = async (payload) => {

      switch (payload) {

        case 'Run Forecast':
          await runForecast();
          break;
      
        default:
          break;
      }
    }

    // Lifecycle hook
    onMounted(async () => {
      try {
        console.log("called")
        propertyGridStore.SetIsPropertyGridActivated(false)
        assetsExplorerStore.SetIsAssetsExplorerActivated(false)
        assetsExplorerStore.setIsAssetCategorySelector(false)
      } catch (error) {
        console.error('Store initialization error:', error)
      }
      frequencyMode.value = 'automatic'
      await fetchStoredNetworksByAssetGroup();
    })

    return {
      // TOOLBOX
      toolboxButtons,

      // SETUP
      predictionStart,
      predictionEnd,
      
      // TIME FREQUENCY
      frequencyMode,
      selectedTimeUnit,
      userDefinedFrequency,
      timeUnitOptions,
      

      // Methods
      runForecast,
      dialogTitle,
      isLoading,
      storedNetworks,
      selectedNetwork,
      updateSelectedStoredNetwork,
      reportingFrequencyMode,
      selectedReportingTimeUnit,
      userDefinedReportingFrequency,
      toolBarItemClick
    }
  }
}
</script>

<style lang="scss">
.prediction-params-page {
  background-color: $bg-color;
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