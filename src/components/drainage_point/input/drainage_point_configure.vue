<template>
  <div class="well-performance-container">

    <!-- Inflow Performance Section -->
    <q-card class="custom-card q-mb-sm">
      <q-card-section>
        <div class="section-title">Drainagepoint Configure</div>
        <div class="grid-container inflow-performance-grid">
          <q-input
            v-model="dpName"
            label="Drainage Point"
            readonly
            outlined
            class="form-item"
          />
          <q-select
            :model-value="selectedWellType"
            option-disable="inactive"
            :options="wellTypes"
            label="Well Types"
            outlined
            class="form-item"
            option-value="id"
            option-label="type"
            name="type"
            emit-value
            map-options
            @update:model-value="updateSelectedWellType($event)"
          />
          <q-select
            :model-value="selectedFluidType"
            option-disable="inactive"
            :options="fluidTypes"
            label="Fluid Type"
            outlined
            class="form-item"
            option-value="id"
            option-label="type"
            name="type"
            emit-value
            map-options
            @update:model-value="updateSelectedFluidType($event)"
          />
          <q-select
            :model-value="selectedWellModel"
            option-disable="inactive"
            :options="wellModels"
            label="Well Model"
            outlined
            class="form-item"
            option-value="id"
            option-label="type"
            name="type"
            emit-value
            map-options
            @update:model-value="updateSelectedWellModel($event)"
          />
          <q-input
            :model-value="onStreamDate"
            label="Onstream Date"
            type="date"
            outlined
            class="form-item"
            @update:model-value="updateOnStreamDate($event)"
          />
        </div>
      </q-card-section>
    </q-card>

  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { WELLMODELS, WELLTYPES, FLUIDTYPES } from '../../../constants/asset_models';

export default {
  name: 'DrainagePointConfigure',
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
    console.log("props.activeDrainagePoint: ", props.activeDrainagePoint);
    //console.log("WELLTYPES: ", WELLTYPES)
    //console.log("WELLMODELS: ", WELLMODELS)

    const dpName = ref(props.selectedComponent?.id)
    const wellTypes = ref(WELLTYPES)
    const selectedWellType = ref(props.activeDrainagePoint.Configure?.selectedWellType)
    const wellModels = ref(WELLMODELS)
    const selectedWellModel = ref(props.activeDrainagePoint.Configure?.selectedWellModel);
    const onStreamDate = ref(props.activeDrainagePoint.Configure?.onStreamDate)
    const fluidTypes = ref(FLUIDTYPES)
    const selectedFluidType = ref(props.activeDrainagePoint.Configure?.selectedFluidType);

    const updateOnStreamDate = (value) => {

      // Update local state
      onStreamDate.value = value;

      
      // Emit to parent
      emit('updateActiveAssetInput', {
        value: onStreamDate.value,
        variable: "onStreamDate",
        modelName: "Configure"
      });
  }

  const updateSelectedWellModel = (value) => {
    console.log("value: ", value)

    selectedWellModel.value = value;

      
      // Emit to parent
      emit('updateActiveAssetInput', {
        value: selectedWellModel.value,
        variable: "selectedWellModel",
        modelName: "Configure"
      });
  }

  const updateSelectedWellType = (value) => {
    console.log("value: ", value)

    selectedWellType.value = value;

      
      // Emit to parent
      emit('updateActiveAssetInput', {
        value: selectedWellType.value,
        variable: "selectedWellType",
        modelName: "Configure"
      });
  }

  const updateSelectedFluidType = (value) => {
    console.log("value: ", value)

    selectedFluidType.value = value;

      
      // Emit to parent
      emit('updateActiveAssetInput', {
        value: selectedFluidType.value,
        variable: "selectedFluidType",
        modelName: "Configure"
      });
  }

    watch(() => props.selectedComponent, (newVal) => {
      dpName.value = newVal?.id
    }, { deep: true })

    watch(() => props.activeDrainagePoint, (newVal) => {
      console.log("activeDrainagePoint prop changed in child:", newVal)
      selectedWellType.value = newVal.Configure?.selectedWellType
      selectedWellModel.value = newVal.Configure?.selectedWellModel
      onStreamDate.value = newVal.Configure?.onStreamDate
      selectedFluidType.value = newVal.Configure?.selectedFluidType
    }, { deep: true, immediate: true })



    return {
      dpName,
      wellTypes,
      selectedWellType,
      wellModels,
      selectedWellModel,
      onStreamDate,
      updateOnStreamDate,
      updateSelectedWellModel,
      updateSelectedWellType,
      fluidTypes,
      selectedFluidType,
      updateSelectedFluidType
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
  grid-template-columns: 1fr;
}

.fluid-properties-grid {
  grid-template-columns: 1fr;
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
    grid-template-columns: 1fr;
  }
  
  .fluid-properties-grid {
    grid-template-columns: 1fr;
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