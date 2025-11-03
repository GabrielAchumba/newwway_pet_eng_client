<template>
  <div class="well-performance-container">
    <!-- Inflow Performance Section -->
    <q-card class="custom-card q-mb-sm">
      <q-card-section>
        <div class="section-title">Inflow Performance</div>
        <div class="grid-container inflow-performance-grid">
          <q-select
            :model-value="selectedIPRType"
            option-disable="inactive"
            :options="iprTypes"
            label="IPR Type"
            outlined
            class="form-item"
            option-value="id"
            option-label="type"
            name="type"
            emit-value
            map-options
            @update:model-value="updateSelectedIPRType($event)"
          />
          <q-input
            :model-value="productivityIndex"
            label="Productivity Index"
            outlined
            type="number"
            class="form-item"
            @update:model-value="updateProductivityIndex($event)"
          />

          <q-input
            :model-value="reservoirPressure"
            label="Reservoir Pressure"
            outlined
            type="number"
            class="form-item"
            @update:model-value="updateReservoirPressure($event)"
          />
          <q-input
            :model-value="reservoirTemperature"
            label="Reservoir Temperature"
            outlined
            type="number"
            class="form-item"
            @update:model-value="updateReservoirTemperature($event)"
          />
          <q-btn 
            label="IPR Match" 
            class="custom-btn form-item"
            style="margin-top: 24px;"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Fluid Properties Section -->
    <q-card class="custom-card">
      <q-card-section>
        <div class="section-title">Fluid Properties</div>
        <div class="grid-container fluid-properties-grid">
          <q-input
            :model-value="oilGravity"
            label="Oil Gravity"
            outlined
            type="number"
            class="form-item"
            @update:model-value="updateOilGravity($event)"
          />
          <q-input
            :model-value="gasGravity"
            label="Gas Gravity"
            outlined
            type="number"
            class="form-item"
            @update:model-value="updateGasGravity($event)"
          />
          <q-input
            :model-value="gasFraction"
            :label="gasFractionLabel"
            outlined
            type="number"
            class="form-item"
            @update:model-value="updateGasFraction($event)"
          />
          <q-input
            :model-value="waterFraction"
            :label="waterFractionLabel"
            outlined
            type="number"
            class="form-item"
            @update:model-value="updateWaterFraction($event)"
          />
          <q-input
            :model-value="waterSalinity"
            label="Water Salinity"
            outlined
            type="number"
            class="form-item"
            @update:model-value="updateWaterSalinity($event)"
          />
          <q-input
            :model-value="h2S"
            label="H2S Fraction"
            outlined
            type="number"
            class="form-item"
            @update:model-value="updateH2S($event)"
          />
          <q-input
            :model-value="co2"
            label="CO2 Fraction"
            outlined
            type="number"
            class="form-item"
            @update:model-value="updateCO2($event)"
          />
          <q-input
            :model-value="n2"
            label="N2 Fraction"
            outlined
            type="number"
            class="form-item"
            @update:model-value="updateN2($event)"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { OILIPRTYPES, GASIPRTYPES } from '../../../../constants/asset_models';

export default {
  name: 'WellPerformanceAnalysis',
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

    const fluidType = ref(props.activeDrainagePoint.Configure?.selectedFluidType ?? 1);
    console.log("fluidType.value: ", fluidType.value)

    // Inflow Performance data
    const iprTypes = ref(fluidType.value === 1 ? OILIPRTYPES : GASIPRTYPES);
    const selectedIPRType = ref(props.activeDrainagePoint.IPR?.selectedIPRType);
    const productivityIndex = ref(props.activeDrainagePoint.IPR?.productivityIndex);
    const reservoirPressure = ref(props.activeDrainagePoint.IPR?.reservoirPressure);
    const reservoirTemperature = ref(props.activeDrainagePoint.IPR?.reservoirTemperature);

    // Fluid Properties data
    const oilGravity = ref(props.activeDrainagePoint.IPR?.oilGravity);
    const gasGravity = ref(props.activeDrainagePoint.IPR?.gasGravity);
    const gasFraction = ref(props.activeDrainagePoint.IPR?.gasFraction);
    const gasFractionLabel = ref(fluidType.value === 1 ? "Gas Oil Ratio" : "Condensate Gas Ratio");
    const waterFraction = ref(props.activeDrainagePoint.IPR?.waterFraction);
    const waterFractionLabel = ref(fluidType.value === 1 ? "Watercut" : "Water Gas Ratio");
    const waterSalinity = ref(props.activeDrainagePoint.IPR?.waterSalinity);
    const h2S = ref(props.activeDrainagePoint.IPR?.h2S);
    const co2 = ref(props.activeDrainagePoint.IPR?.co2);
    const n2 = ref(props.activeDrainagePoint.IPR?.n2);

    const updateSelectedIPRType = (value) => {
      
      selectedIPRType.value = value;
      
      emit('updateActiveAssetInput', {
        value: selectedIPRType.value,
        variable: "selectedIPRType",
        modelName: "IPR"
      });

    }

    const updateReservoirPressure = (value) => {
      
      reservoirPressure.value = value;
      
      emit('updateActiveAssetInput', {
        value: reservoirPressure.value,
        variable: "reservoirPressure",
        modelName: "IPR"
      });

    }

    const updateReservoirTemperature = (value) => {
      
      reservoirTemperature.value = value;
      
      emit('updateActiveAssetInput', {
        value: reservoirTemperature.value,
        variable: "reservoirTemperature",
        modelName: "IPR"
      });

    }

    const updateOilGravity = (value) => {
      
      oilGravity.value = value;
      
      emit('updateActiveAssetInput', {
        value: oilGravity.value,
        variable: "oilGravity",
        modelName: "IPR"
      });

    }

    const updateGasGravity = (value) => {
      
      gasGravity.value = value;
      
      emit('updateActiveAssetInput', {
        value: gasGravity.value,
        variable: "gasGravity",
        modelName: "IPR"
      });

    }

    const updateGasFraction = (value) => {
      
      gasFraction.value = value;
      
      emit('updateActiveAssetInput', {
        value: gasFraction.value,
        variable: "gasFraction",
        modelName: "IPR"
      });

    }

    const updateWaterFraction = (value) => {
      
      waterFraction.value = value;
      
      emit('updateActiveAssetInput', {
        value: waterFraction.value,
        variable: "waterFraction",
        modelName: "IPR"
      });

    }

    const updateWaterSalinity = (value) => {
      
      waterSalinity.value = value;
      
      emit('updateActiveAssetInput', {
        value: waterSalinity.value,
        variable: "waterSalinity",
        modelName: "IPR"
      });

    }

    const updateH2S = (value) => {
      
      h2S.value = value;
      
      emit('updateActiveAssetInput', {
        value: h2S.value,
        variable: "h2S",
        modelName: "IPR"
      });

    }

    const updateCO2 = (value) => {
      
      co2.value = value;
      
      emit('updateActiveAssetInput', {
        value: co2.value,
        variable: "co2",
        modelName: "IPR"
      });

    }

    const updateN2 = (value) => {
      
      n2.value = value;
      
      emit('updateActiveAssetInput', {
        value: n2.value,
        variable: "n2",
        modelName: "IPR"
      });

    }

    const updateProductivityIndex = (value) => {
      
      productivityIndex.value = value;
      
      emit('updateActiveAssetInput', {
        value: productivityIndex.value,
        variable: "productivityIndex",
        modelName: "IPR"
      });

    }

    watch(
      () => props.activeDrainagePoint,
      (newActiveDrainagePoint) => {
        console.log("newActiveDrainagePoint: ", newActiveDrainagePoint);

        fluidType.value = newActiveDrainagePoint.Configure?.selectedFluidType ?? 1;
        gasFractionLabel.value = fluidType.value === 1 ? "Gas Oil Ratio" : "Condensate Gas Ratio";
        waterFractionLabel.value = fluidType.value === 1 ? "Watercut" : "Water Gas Ratio";


         // Inflow Performance data
        iprTypes.value = fluidType.value === 1 ? OILIPRTYPES : GASIPRTYPES;
        selectedIPRType.value = newActiveDrainagePoint.IPR?.selectedIPRType;
        productivityIndex.value = newActiveDrainagePoint.IPR?.productivityIndex;
        reservoirPressure.value = newActiveDrainagePoint.IPR?.reservoirPressure;
        reservoirTemperature.value = rnewActiveDrainagePoint.IPR?.reservoirTemperature;

        // Fluid Properties data
        oilGravity.value = newActiveDrainagePoint.IPR?.oilGravity;
        gasGravity.value = newActiveDrainagePoint.IPR?.gasGravity;
        gasFraction.value = newActiveDrainagePoint.IPR?.gasFraction;
        waterFraction.value = newActiveDrainagePoint.IPR?.waterFraction;
        waterSalinity.value = newActiveDrainagePoint.IPR?.waterSalinity;
        h2S.value = newActiveDrainagePoint.IPR?.h2S;
        co2.value = newActiveDrainagePoint.IPR?.co2;
        n2.value = newActiveDrainagePoint.IPR?.n2;
      }
    )
    

    return {
      fluidType,
      iprTypes,
      selectedIPRType,
      reservoirPressure,
      reservoirTemperature,
      oilGravity,
      gasGravity,
      gasFraction,
      gasFractionLabel,
      waterFraction,
      waterFractionLabel,
      waterSalinity,
      h2S,
      co2,
      n2,
      updateSelectedIPRType,
      updateReservoirPressure,
      updateReservoirTemperature,
      updateOilGravity,
      updateGasGravity,
      updateGasFraction,
      updateWaterFraction,
      updateWaterSalinity,
      updateH2S,
      updateCO2,
      updateN2,
      productivityIndex,
      updateProductivityIndex
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
  grid-template-columns: repeat(3, 1fr);
}

.fluid-properties-grid {
  grid-template-columns: repeat(3, 1fr);
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