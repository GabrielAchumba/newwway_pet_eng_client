<template>
  <div class="well-performance-container">

    <q-card class="custom-card q-mb-sm">
      <q-card-section v-if="!isLoading">
        <div class="section-title">Save Network</div>
        <div class="grid-container inflow-performance-grid">
          <q-input
             :model-value="networkName"
            label="Network Name"
            outlined
            class="form-item"
            @update:model-value="updateNetworkName($event)"
          />
          <q-input
            :model-value="networkDescription"
            label="Network Descriptiom"
            outlined
            class="form-item"
            @update:model-value="updateNetworkDescription($event)"
          />
        </div>
      </q-card-section>
      <div v-show="isLoading" class="spinner-container">
        <q-spinner color="secondary" size="8em" :thickness="10" />
      </div>
    </q-card>

  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'DrainagePointConfigure',
  props: {
    isLoading: {
        type: Boolean,
        default: false
    }
  },
  emits: ['updateActiveAssetInput'],
  setup(props, { emit }) {


    const networkName = ref(null)
    const networkDescription = ref(null)

    const updateNetworkName = (value) => {

      networkName.value = value;

      // Emit to parent
      emit('updateActiveAssetInput', {
        value: networkName.value,
        variable: "networkName",
        modelName: ""
      });
    }

    const updateNetworkDescription = (value) => {

      networkDescription.value = value;

      // Emit to parent
      emit('updateActiveAssetInput', {
        value: networkDescription.value,
        variable: "networkDescription",
        modelName: ""
      });
    }


    return {
      networkName,
      networkDescription,
      updateNetworkName,
      updateNetworkDescription,
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