<template>
  <div class="well-performance-container">

    <!-- Inflow Performance Section -->
    <q-card class="custom-card q-mb-sm">
      <q-card-section>
        <div class="section-title">DCA Input</div>
        <div class="grid-container inflow-performance-grid">
          <q-input
            :model-value="initialCumProd"
            label="Initial Cumulative Production"
            outlined
            class="form-item"
            type="number"
            @update:model-value="updateInitialCumProd($event)"
          />
          <q-input
            :model-value="ultimateRecovery"
            label="Ultimate Recovery"
            outlined
            class="form-item"
            type="number"
            @update:model-value="updateUltimateRecovery($event)"
          />
          <q-input
            :model-value="plateauPeriod"
            label="Pleatue Period"
            outlined
            class="form-item"
            type="number"
            @update:model-value="updatePlateauPeriod($event)"
          />
          <q-select
            :model-value="selectedDeclineMethod"
            option-disable="inactive"
            :options="declineMethods"
            label="Decline Method"
            outlined
            class="form-item"
            option-value="id"
            option-label="type"
            name="type"
            emit-value
            map-options
            @update:model-value="updateSelectedDeclineMethod($event)"
          />
          <q-input
            :model-value="rateDeclineRate"
            label="Decline Rate"
            outlined
            class="form-item"
            type="number"
            @update:model-value="updateRateDeclineRate($event)"
          />
          <q-input
            :model-value="gasFractionDeclineRate"
            label="GOR Rate of Change"
            outlined
            class="form-item"
            type="number"
            @update:model-value="updateGasFractionDeclineRate($event)"
          />
          <q-input
            :model-value="waterFractionDeclineRate"
            label="Watercut Rate of Change"
            outlined
            class="form-item"
            type="number"
            @update:model-value="updateWaterFractionDeclineRate($event)"
          />
        </div>
      </q-card-section>
    </q-card>

  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { DECLINEMETHODS } from '../../../../constants/asset_models';

export default {
  name: 'DrainagePointDCAInput',
  props: {
    selectedComponent: {
      type: Object,
      default: () => ({})
    },
    activeDrainagePoint: {
        type: Object,
        default: () => ({})
    }
  },
 emits: ['updateActiveAssetInput'],
  setup(props, { emit }) {
    const $q = useQuasar()
    console.log("props.selectedComponent: ", props.selectedComponent);

    const initialCumProd = ref(props.activeDrainagePoint.DCA?.initialCumProd)
    const ultimateRecovery = ref(props.activeDrainagePoint.DCA?.ultimateRecovery)
    const plateauPeriod = ref(props.activeDrainagePoint.DCA?.plateauPeriod)
    const declineMethods = ref(DECLINEMETHODS)
    const selectedDeclineMethod = ref(props.activeDrainagePoint.DCA?.selectedDeclineMethod)
    const rateDeclineRate = ref(props.activeDrainagePoint.DCA?.rateDeclineRate)
    const gasFractionDeclineRate = ref(props.activeDrainagePoint.DCA?.gasFractionDeclineRate)
    const waterFractionDeclineRate = ref(props.activeDrainagePoint.DCA?.waterFractionDeclineRate)

    const updateInitialCumProd = (value) => {

      // Update local state
      initialCumProd.value = value;
      
      emit('updateActiveAssetInput', {
        value: initialCumProd.value,
        variable: "initialCumProd",
        modelName: "DCA"
      });

    }

    const updateUltimateRecovery = (value) => {

      // Update local state
      ultimateRecovery.value = value;
      
      emit('updateActiveAssetInput', {
        value: ultimateRecovery.value,
        variable: "ultimateRecovery",
        modelName: "DCA"
      });

    }

    const updatePlateauPeriod = (value) => {

      // Update local state
      plateauPeriod.value = value;
      
      emit('updateActiveAssetInput', {
        value: plateauPeriod.value,
        variable: "plateauPeriod",
        modelName: "DCA"
      });

    }

    const updateSelectedDeclineMethod = (value) => {

      // Update local state
      selectedDeclineMethod.value = value;
      
      emit('updateActiveAssetInput', {
        value: selectedDeclineMethod.value,
        variable: "selectedDeclineMethod",
        modelName: "DCA"
      });

    }


    const updateRateDeclineRate = (value) => {

      // Update local state
      rateDeclineRate.value = value;
      
      emit('updateActiveAssetInput', {
        value: rateDeclineRate.value,
        variable: "rateDeclineRate",
        modelName: "DCA"
      });

    }

    const updateGasFractionDeclineRate = (value) => {

      // Update local state
      gasFractionDeclineRate.value = value;
      
      emit('updateActiveAssetInput', {
        value: gasFractionDeclineRate.value,
        variable: "gasFractionDeclineRate",
        modelName: "DCA"
      });

    }

    const updateWaterFractionDeclineRate = (value) => {

      // Update local state
      waterFractionDeclineRate.value = value;
      
      emit('updateActiveAssetInput', {
        value: waterFractionDeclineRate.value,
        variable: "waterFractionDeclineRate",
        modelName: "DCA"
      });

    }

    

    watch(() => props.selectedComponent, (newVal) => {
      //dpName.value = newVal?.id
    }, { deep: true })

    watch(() => props.activeDrainagePoint, (newVal) => {
    
      initialCumProd.value = newVal.DCA?.initialCumProd
      ultimateRecovery.value = newVal.DCA?.ultimateRecovery
      plateauPeriod.value = newVal.DCA?.plateauPeriod
      selectedDeclineMethod.value = newVal.DCA?.selectedDeclineMethod
      rateDeclineRate.value = newVal.DCA?.rateDeclineRate
      gasFractionDeclineRate.value = newVal.DCA?.gasFractionDeclineRate
      waterFractionDeclineRate.value = newVal.DCA?.waterFractionDeclineRate

    }, { deep: true, immediate: true })

    return {
      initialCumProd,
      ultimateRecovery,
      plateauPeriod,
      declineMethods,
      selectedDeclineMethod,
      rateDeclineRate,
      gasFractionDeclineRate,
      waterFractionDeclineRate,
      updateInitialCumProd,
      updateUltimateRecovery,
      updatePlateauPeriod,
      updateSelectedDeclineMethod,
      updateRateDeclineRate,
      updateGasFractionDeclineRate,
      updateWaterFractionDeclineRate
    }
  }
}
</script>

<style scoped>
.well-performance-container {
  max-width: 1200px;
  margin: 0 auto;
  /* padding: 20px;
  background-color:red; */
}

.custom-card {
  background-color: #FFFFFF;
  border-radius: 8px;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #0A1D3F;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #E2372D;
}

.layout-container.row {
  display: flex;
  flex-direction: row;
  gap: 15px;
}

.layout-container.column {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.layout-container.row .form-item {
  flex: 1;
}

.grid-container {
  display: grid;
  gap: 15px;
}

.inflow-performance-grid {
  grid-template-columns: repeat(2, 1fr);
}

.fluid-properties-grid {
  grid-template-columns: repeat(2, 1fr);
}

.custom-btn {
  background-color: #0A1D3F;
  color: white;
}

.custom-btn:hover {
  background-color: #E2372D;
}

.remove-btn {
  background-color: #E2372D;
  color: white;
}

.remove-btn:hover {
  background-color: #c12c24;
}

/* Medium screens */
@media (max-width: 992px) {
  .inflow-performance-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .fluid-properties-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Small screens */
@media (max-width: 768px) {
  .inflow-performance-grid {
    grid-template-columns: 1fr;
  }
  
  .fluid-properties-grid {
    grid-template-columns: 1fr;
  }
  
  .well-performance-container {
    padding: 10px;
  }
}
</style>