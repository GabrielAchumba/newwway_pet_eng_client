<template>
  <q-page class="prediction-params-page">
    <toolbox :buttons="toolboxButtons" />

    <div class="page-container">
      <div class="row q-col-gutter-lg">
        <!-- SETUP Section -->
        <div class="col-md-6 col-sm-12">
          <q-card class="setup-section">
            <q-card-section>
              <div class="text-caption">SETUP</div>
            </q-card-section>
            <q-card-section class="q-gutter-y-md">
              <!-- Prediction Start -->
              <div>
                <q-input
                  filled
                  v-model="predictionStart"
                  label="Prediction Start"
                  type="date"
                  stack-label
                  bg-color="card-bg"
                  color="secondary"
                />
              </div>
              
              <!-- Prediction End -->
              <div>
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
              
              <!-- Abandonment Rate -->
              <div>
                <q-input
                  filled
                  v-model="abandonmentRate"
                  label="Abandonment Rate"
                  type="number"
                  stack-label
                  bg-color="card-bg"
                  color="secondary"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>

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
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { usePropertyGridStore } from 'src/store/modules/propertyGridStore'
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore'
import Toolbox from 'src/components/headers/CustomToolBox.vue'


export default {
  components: {
    Toolbox
  },
  setup() {
    const propertyGridStore = usePropertyGridStore()
    const assetsExplorerStore = useAssetsExplorerStore()
    
    // SETUP section data
    const predictionStart = ref('')
    const predictionEnd = ref('')
    const abandonmentRate = ref('')
    
    // TIME FREQUENCY section data
    const frequencyMode = ref('automatic')
    const selectedTimeUnit = ref('day')
    const userDefinedFrequency = ref('')
    const timeUnitOptions = ['day', 'month', 'year']

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
      frequencyMode.value = 'automatic'
    })
    
    // Computed property
    const items = computed(() => assetsExplorerStore.listItems)

    return {
      // TOOLBOX
      toolboxButtons,

      // SETUP
      predictionStart,
      predictionEnd,
      abandonmentRate,
      
      // TIME FREQUENCY
      frequencyMode,
      selectedTimeUnit,
      userDefinedFrequency,
      timeUnitOptions,
      
      // Computed
      items,

      // Methods
      saveData,
      cancelChanges,
      printData
    }
  }
}
</script>

<style lang="scss">
.prediction-params-page {
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