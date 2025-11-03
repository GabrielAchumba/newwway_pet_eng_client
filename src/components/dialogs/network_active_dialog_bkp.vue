<template>
  <q-card>
    <q-toolbar class="bg-secondary text-primary">
      <q-toolbar-title class="text-caption">
        {{ selectedComponent?.label || 'Component Details' }} - {{ selectedComponent?.nodeType || 'Unknown Type' }}
      </q-toolbar-title>
      <q-btn flat round dense icon="close" v-close-popup size="sm" />
    </q-toolbar>

    <q-card-section class="q-pt-md">
      <!-- Form content -->
      <div v-if="selectedComponent" class="column q-gutter-md">
        <div class="text-h6">Component Information</div>
        
        <q-input 
          filled
          v-model="selectedComponent.label"
          label="Component Name"
        />
        
        <q-input 
          filled
          v-model="selectedComponent.type"
          label="Component Type"
          readonly
        />
        
        <q-select
          filled
          v-model="selectedComponent.dataStatus"
          :options="dataStatusOptions"
          label="Data Status"
          emit-value
          map-options
        />
        
        <div class="row q-gutter-sm q-pt-md">
          <q-space />
          <q-btn label="Cancel" color="grey" @click="handleCancel" />
          <q-btn label="Save" color="primary" @click="handleSave" />
        </div>
      </div>
    </q-card-section>

    <q-separator></q-separator>

    <q-card-actions>
        <q-btn-group 
            push 
            class="row q-pa-sm bg-primary text-primary items-stretch"
            style="width: 100%"
            flat>
              <q-btn class="col" color="accent" glossy text-color="primary" 
              push label="IPR Layer" size="sm"/>
              <q-btn class="col" color="accent" glossy text-color="primary" 
              push label="Grid View" size="sm"/>
        </q-btn-group>
        <q-btn-group 
            push 
            class="row q-pa-sm bg-primary text-primary items-stretch"
            style="width: 100%"
            flat>
              <q-btn class="col" color="accent" glossy text-color="primary" 
              push label="DCA" size="sm"/>
              <q-btn class="col" color="accent" glossy text-color="primary" 
              push label="IPR" size="sm"/>
              <q-btn class="col" color="accent" glossy text-color="primary" 
              push label="VLP" size="sm"/>
              <q-btn class="col" color="accent" glossy text-color="primary" 
              push label="Constraints" size="sm"/>
              <q-btn class="col" color="accent" glossy text-color="primary" 
              push label="Schedule" size="sm"/>
        </q-btn-group>
        <q-btn-group 
            push 
            class="row q-pa-sm bg-primary text-primary items-stretch"
            style="width: 100%"
            flat>
              <q-btn class="col" color="accent" glossy text-color="primary" 
              push label="Summary" size="sm"/>
              <q-btn class="col" color="accent" glossy text-color="primary" 
              push label="Input" size="sm"/>
              <q-btn class="col" color="accent" glossy text-color="primary" 
              push label="Results" size="sm"/>
            </q-btn-group>
    </q-card-actions>
  </q-card>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'NetworkActiveDialog',
  props: {
    selectedComponent: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['saved', 'cancel'],
  setup(props, { emit }) {
    console.log("props.selectedComponent: ", props.selectedComponent)
    const dataStatusOptions = [
      { label: 'No Data', value: 'no-data' },
      { label: 'Partial Data', value: 'partial' },
      { label: 'Complete Data', value: 'complete' }
    ];

    const handleSave = () => {
      emit('saved', props.selectedComponent);
    };

    const handleCancel = () => {
      emit('cancel');
    };

    return {
      dataStatusOptions,
      handleSave,
      handleCancel
    };
  }
});
</script>

<style scoped>
/* Add any component-specific styles here */
</style>