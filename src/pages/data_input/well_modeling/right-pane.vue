<template>
  <div class="right-pane">
    <!-- Dropdown for lift curves -->
    <div class="pane-section">
      <div class="section-title">Lift Curves</div>
      <q-select
        v-model="selectedLiftCurve"
        :options="liftCurvesOptions"
        label="Select Lift Curve"
        outlined
        dense
        emit-value
        map-options
        @update:model-value="onCurveChange"
        />
      
    </div>
    

    <!-- Rate and Pwf Section -->
    <div v-if="ratePwfSection" class="pane-section">
      <div class="section-title">Current Values</div>
      <div class="values-container">
        <div class="value-item">
          <span class="value-label">Rate:</span>
          <span class="value-number">{{ rate }} bbl/d</span>
        </div>
        <div class="value-item">
          <span class="value-label">Pwf:</span>
          <span class="value-number">{{ pwf }} psi</span>
        </div>
      </div>
    </div>

    <!-- IPR Section -->
    <div v-if="parameters" class="pane-section">
      <div class="section-title">Parameters</div>
      <div class="ipr-form">
        <q-input
          v-for="parameterData in parametersData"
          :key="parameterData.name"
          v-model="parameterData.value"
          :label="parameterData.title"
          outlined
          dense
          type="number"
          class="q-mb-sm"
          @update:model-value="onParameterDataUpdate(parameterData)"
        />
        <!-- <q-input
          v-model="iprData.waterCut"
          label="Water Cut"
          outlined
          dense
          type="number"
          class="q-mb-sm"
          @update:model-value="onIprUpdate"
        />
        <q-input
          v-model="iprData.pi"
          label="PI"
          outlined
          dense
          type="number"
          class="q-mb-sm"
          @update:model-value="onIprUpdate"
        />
        <q-input
          v-model="iprData.pressure"
          label="Pressure"
          outlined
          dense
          type="number"
          class="q-mb-sm"
          @update:model-value="onIprUpdate"
        /> -->
      </div>
    </div>

    <!-- VLP Sensitivities -->
    <div v-if="vlpSensitivitiesPane" class="pane-section">
      <div class="section-title">{{ vlpSensitivityTitle }}</div>
      <div class="sensitivities-container">
        <q-list dense bordered class="rounded-borders sensitivities-list">
          <q-item 
            v-for="sensitivity in vlpSensitivities" 
            :key="sensitivity.id"
            clickable
            v-ripple
            :active="selectedSensitivityId === sensitivity.id"
            active-class="sensitivity-active"
            @click="selectSensitivity(sensitivity.id)"
          >
            <q-item-section>
              <q-item-label>{{ sensitivity.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'

export default {
  name: 'RightPane',
  props: {
    selectedCurve: {
        type: String,
        default: 'Select Lift Curves'
    },
    rate: Number,
    pwf: Number,
    liftCurves: {
      type: Array,
      default: () => [{ label: 'Select Lift Curves', value: 'Select Lift Curves' }]
    },
    ratePwfSectionProp: {
        type: Boolean,
        default: false

    },
    parametersProp : {
        type: Boolean,
        default: true

    },
    parametersDataProp: {
        type: Array,
        default: () => []
    },
    vlpSensitivitiesPaneProp: {
        type: Boolean,
        default: false
    },
    vlpSensitivitiesProp: {
        type: Array,
        default: () => []
    },
    vlpSensitivityTitleProp: {
        type: String,
        default: "VLP Sensitivities"
    },
    selectedSensitivityIdProp: {
        type: String,
        default: ""
    }
  },
  emits: ['curve-change', 'update-parameter-data', 'sensitivity-selected'],
  setup(props, { emit }) {

    const liftCurvesOptions = computed(() => {
        console.log("props.liftCurves: ", props.liftCurves);
        return  props.liftCurves;
    });

    const selectedLiftCurve = computed(() => props.selectedCurve);

    const ratePwfSection = computed(() => props.ratePwfSectionProp);

    const parameters = computed(() => props.parametersProp);

    const vlpSensitivitiesPane = computed(() => props.vlpSensitivitiesPaneProp);

    const vlpSensitivities = computed(() => props.vlpSensitivitiesProp);

    const vlpSensitivityTitle = computed(() => props.vlpSensitivityTitleProp);

    const parametersData = computed(() => props.parametersDataProp);

    // Track selected sensitivity
    const selectedSensitivityId = ref(props.selectedSensitivityIdProp);

    const selectSensitivity = (sensitivityId) => {
      selectedSensitivityId.value = sensitivityId;
      // Emit the selected sensitivity to parent component
      const selectedSensitivity = vlpSensitivities.value.find(s => s.id === sensitivityId);
      emit('sensitivity-selected', selectedSensitivity);
    }


    watch(() => liftCurvesOptions, (newCurves) => {
      console.log('liftCurves prop updated:', newCurves)
    })

    // const vlpSensitivities = ref([
    //   { id: 1, name: 'Tubing Size' },
    //   { id: 2, name: 'Choke Size' },
    //   { id: 3, name: 'Gas Lift' },
    //   { id: 4, name: 'Water Cut' }
    // ])

    const iprData = ref({
      gor: 500,
      waterCut: 15,
      pi: 2.5,
      pressure: 2500,

    })

    const onCurveChange = (newCurve) => {
      emit('curve-change', newCurve)
    }

    const onParameterDataUpdate = (parameterData) => {
      emit('update-parameter-data', parameterData)
    }

    return {
      liftCurvesOptions,
      selectedLiftCurve,
      vlpSensitivities,
      selectedSensitivityId,
      selectSensitivity,
      parametersData,
      onParameterDataUpdate,
      onCurveChange,
      ratePwfSection,
      parameters,
      vlpSensitivitiesPane,
      vlpSensitivityTitle
    }
  }
}
</script>

<style scoped>
.right-pane {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.pane-section {
  background: #F0F4F8;
  border-radius: 8px;
  padding: 16px;
}

.section-title {
  font-weight: bold;
  color: #0A1D3F;
  margin-bottom: 12px;
  font-size: 14px;
}

.values-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.value-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.value-label {
  color: #475569;
  font-size: 12px;
}

.value-number {
  color: #0A1D3F;
  font-weight: bold;
  font-size: 12px;
}

.ipr-form {
  display: flex;
  flex-direction: column;
}

.sensitivities-container {
  display: flex;
  flex-direction: column;
}

.sensitivities-list {
  max-height: 60vh;
  overflow-y: auto;
}

.sensitivity-active {
  background-color: #1976d2;
  color: white;
}

.sensitivities-list .q-item:hover {
  background-color: #e3f2fd;
}
</style>