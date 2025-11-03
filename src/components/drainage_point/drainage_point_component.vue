<template>
  <div class="container">
    <div class="scrollable-content">
      <DrainagePointInput
      v-if="dpInputVisible"
      :selectedComponent="selectedComponent"
      :dpIPRInputVisible="dpIPRInputVisible"
      :dpConstraintsVisible="dpConstraintsVisible"
      :dpScheduleVisible="dpScheduleVisible"
      :dpVLPInputVisible="dpVLPInputVisible"
      :dpDCAInputVisible="dpDCAInputVisible"
      :dpInputConfigureVisible="dpInputConfigureVisible"
      :activeDrainagePoint="activeDrainagePoint"
      @updateActiveAssetInput="updateActiveAssetInput"
      @updateEditableTable="updateEditableTable"/>

      <DPForecastResults 
      v-if="dpResultVisible"/>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import DrainagePointInput from './input/drainage_point_input.vue';
import DPForecastResults from './results/dp_forecast_results.vue';

export default defineComponent({
  name: 'DrainagePointComponent',
  components:{
    DrainagePointInput,
    DPForecastResults
  },
  props: {
    selectedComponent: {
      type: Object,
      default: () => ({})
    },
    dpResultVisible: {
      type: Boolean,
      default: false
    },
    dpInputVisible: {
      type: Boolean,
      default: false
    },
    dpIPRInputVisible: {
      type: Boolean,
      default: false
    },
    dpConstraintsVisible: {
      type: Boolean,
      default: false
    },
    dpScheduleVisible: {
      type: Boolean,
      default: false
    },
    dpVLPInputVisible: {
      type: Boolean,
      default: false
    },
    dpDCAInputVisible: {
      type: Boolean,
      default: false
    },
    dpInputConfigureVisible:{
      type: Boolean,
      default: false
    },
    activeDrainagePoint: {
        type: Object,
        default: () => ({})
    }
  },
  emits: ['saved', 'cancel', 'updateActiveAssetInput', 'updateEditableTable'],
  setup(props, { emit }) {
    console.log("props.activeDrainagePoint: ", props.activeDrainagePoint)

    const dpResultVisible = ref(props.dpResultVisible);
    const dpIPRInputVisible = ref(props.dpIPRInputVisible);
    const dpConstraintsVisible = ref(props.dpConstraintsVisible);
    const dpScheduleVisible = ref(props.dpScheduleVisible);
    const dpVLPInputVisible = ref(props.dpVLPInputVisible);
    const dpDCAInputVisible = ref(props.dpDCAInputVisible);
    const dpInputVisible = ref(props.dpInputVisible);
    const dpInputConfigureVisible = ref(props.dpInputConfigureVisible);
    const activeDrainagePoint = ref(props.activeDrainagePoint);

    
    const handleSave = () => {
      emit('saved', props.selectedComponent);
    };

    const handleCancel = () => {
      emit('cancel');
    };

    const updateActiveAssetInput = (payload) => {
        emit('updateActiveAssetInput', payload);
    }

    const updateEditableTable = (payload) => {
      emit('updateEditableTable', payload);
    };

    watch(
      () => props.dpResultVisible,
      (newDPResultVisible) => {
        console.log("newDPResultVisible: ", newDPResultVisible);
        dpResultVisible.value = newDPResultVisible;
      },
      { immediate: true }
    )

    watch(
      () => props.dpInputVisible, 
      (newDPInputVisible) => {
        console.log("newDPInputVisible: ", newDPInputVisible);
        dpInputVisible.value = newDPInputVisible;
      },
      { immediate: true }
    )

    watch(
      () => props.dpIPRInputVisible,
      (newDPIPRInputVisible) => {
        console.log("newDPIPRInputVisible: ", newDPIPRInputVisible);
        dpIPRInputVisible.value = newDPIPRInputVisible;
      },
      { immediate: true }
    )

    watch(
      () => props.dpConstraintsVisible,
      (newDPConstraintsVisible) => {
        console.log("newDPConstraintsVisible: ", newDPConstraintsVisible);
        dpConstraintsVisible.value = newDPConstraintsVisible;
      },
      { immediate: true }
    )

    watch(
      () => props.dpScheduleVisible,
      (newDPScheduleVisible) => {
        console.log("newDPScheduleVisible: ", newDPScheduleVisible);
        dpScheduleVisible.value = newDPScheduleVisible;
      },
      { immediate: true }
    )

    watch(
      () => props.dpVLPInputVisible,
      (newDPVLPInputVisible) => {
        console.log("newDPVLPInputVisible: ", newDPVLPInputVisible);
        dpVLPInputVisible.value = newDPVLPInputVisible;
      },
      { immediate: true }
    )

    watch(
      () => props.dpDCAInputVisible,
      (newDPDCAInputVisible) => {
        console.log("newDPDCAInputVisible: ", newDPDCAInputVisible);
        dpDCAInputVisible.value = newDPDCAInputVisible;
      },
      { immediate: true }
    )

    watch(
      () => props.dpInputConfigureVisible,
      (newDPInputConfigureVisible) => {
        console.log("newDPInputConfigureVisible: ", newDPInputConfigureVisible);
        dpInputConfigureVisible.value = newDPInputConfigureVisible;
      },
      { immediate: true }
    )

    watch(
      () => props.activeDrainagePoint,
      (newActiveDrainagePoint) => {
        console.log("newActiveDrainagePoint: ", newActiveDrainagePoint);
        activeDrainagePoint.value = newActiveDrainagePoint;
      },
      { immediate: true, deep: true }
    )

    return {
      handleSave,
      handleCancel,
      dpResultVisible,
      dpIPRInputVisible,
      dpConstraintsVisible,
      dpScheduleVisible,
      dpVLPInputVisible,
      dpDCAInputVisible,
      dpInputConfigureVisible,
      updateActiveAssetInput,
      activeDrainagePoint,
      updateEditableTable
    };
  }
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* or whatever height you need */
  max-height: 80vh; /* adjust as needed */
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  min-height: 0; /* Important for flex child scrolling */
}

.scrollable-content::-webkit-scrollbar {
  display: none;
}

.button-group-container {
  flex-shrink: 0;
  border-top: 1px solid #e0e0e0; /* Optional separator */
  background-color: var(--q-primary, white);
}
</style>