<template>
  <q-card class="well-type-card q-pa-md">
    <q-card-section class="q-pa-none">
      <!-- <div class="text-h6 q-mb-md">Well Type</div> -->
      
      <q-select
        v-model="selectedWellType"
        :options="wellTypeOptions"
        option-label="variable"
        option-value="value"
        emit-value
        map-options
        filled
        bg-color="primary"
        label="Select Well Type"
        class="well-type-selector"
        @update:model-value="onWellTypeChange"
      >
        <template v-slot:option="scope">
          <q-item
            v-bind="scope.itemProps"
            class="well-type-option"
          >
            <q-item-section>
              <q-item-label>{{ scope.opt.variable }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </q-card-section>
  </q-card>
</template>

<script>
import { ref } from 'vue'
import { WELLTYPES } from '../../../constants/asset_models';

export default {
  name: 'WellTypeSelector',
  
  emits: ['well-type-changed'],
  
  setup(props, { emit }) {
    const selectedWellType = ref(null)
    
    const wellTypeOptions = ref(WELLTYPES)

    const onWellTypeChange = (value) => {
      emit('well-type-changed', value)
    }

    return {
      selectedWellType,
      wellTypeOptions,
      onWellTypeChange
    }
  }
}
</script>

<style scoped>
.well-type-card {
  background-color: var(--q-primary);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.well-type-selector {
  border-radius: 6px;
}

.well-type-selector :deep(.q-field__control) {
  border-radius: 6px;
  color: var(--q-secondary);
  font-weight: 500;
}

.well-type-selector :deep(.q-field__label) {
  color: var(--q-forecolor1);
  font-weight: 500;
}

.well-type-selector :deep(.q-field__native) {
  color: var(--q-secondary);
  font-weight: 500;
}

.well-type-option:hover {
  background-color: var(--q-selected-list-item);
}

.well-type-option.q-item--active {
  background-color: var(--q-selected-list-item);
  color: var(--q-secondary);
}

/* Custom styling for the dropdown menu */
.well-type-selector :deep(.q-menu) {
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.well-type-selector :deep(.q-field__control:before) {
  border-color: var(--q-forecolor1);
}

.well-type-selector :deep(.q-field__control:hover:before) {
  border-color: var(--q-secondary);
}

.well-type-selector :deep(.q-field--focused .q-field__control:before) {
  border-color: var(--q-secondary);
  border-width: 2px;
}

.well-type-selector :deep(.q-field--focused .q-field__label) {
  color: var(--q-secondary);
}
</style>