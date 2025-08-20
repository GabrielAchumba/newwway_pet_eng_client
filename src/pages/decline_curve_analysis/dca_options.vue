<template>
  <q-page class="column no-wrap" style="height: 100vh; overflow-y: auto;">
    <!-- Toolbox Section -->
     <toolbox v-show="!showSpinner" :buttons="toolboxButtons" />

    <!-- Upper Section - Two Columns -->
    <div v-show="!showSpinner" class="row q-pa-md" style="flex: 1;">
      <!-- Utility Options Column -->
      <q-card class="col-md-6 col-xs-12" flat bordered> 
        <q-card-section class="bg-secondary text-primary">
          <div class="text-caption">Utility Options</div>
        </q-card-section>
        <q-separator color="card-bar" size="2px"/>
        <q-card-section class="column q-gutter-md">
          <!-- Reservoir Fluid Dropdown -->
          <q-select
            outlined
            v-model="viewModel.reservoirFluid"
            :options="reservoirOptions"
            label="Reservoir Fluid"
            bg-color="card-bg"
            color="secondary"
            label-color="forecolor1"
          />
          
          <!-- Model Dropdown -->
          <q-select
            outlined
            v-model="viewModel.model"
            :options="modelOptions"
            label="Model"
            bg-color="card-bg"
            color="secondary"
            label-color="forecolor1"
          />

          <q-input
            outlined
            v-model="viewModel.referenceDate"
            label="Reference Date"
            bg-color="card-bg"
            color="secondary"
            label-color="forecolor1"
            >
            <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date 
                    v-model="viewModel.referenceDate"
                    mask="YYYY-MM-DD"
                    color="secondary"
                    class="hide-scrollbar"
                    style="max-height: 300px; overflow-y: auto;"
                    />
                </q-popup-proxy>
                </q-icon>
            </template>
        </q-input>
        </q-card-section>
      </q-card>

      <!-- Account Details Column -->
      <q-card class="col-md-6 col-xs-12" flat bordered> 
        <q-card-section class="bg-secondary text-primary">
          <div class="text-caption">Account Details</div>
        </q-card-section>
        <q-separator color="card-bar" size="2px"/>
        <q-card-section class="column q-gutter-md">
          <!-- Readonly Fields -->
          <q-input
            outlined
            v-model="viewModel.company"
            label="Company"
            readonly
            bg-color="card-bg"
            color="secondary"
            label-color="forecolor1"
          />
          <q-select
            outlined
            v-model="viewModel.field"
            :options="fieldOptions"
            label="Field"
            bg-color="card-bg"
            color="secondary"
            label-color="forecolor1"
          />
          <q-input
            outlined
            v-model="viewModel.location"
            label="Location"
            bg-color="card-bg"
            color="secondary"
            label-color="forecolor1"
          />
          <q-input
            outlined
            v-model="viewModel.platform"
            label="Platform"
            bg-color="card-bg"
            color="secondary"
            label-color="forecolor1"
          />
          
          <!-- Editable Analyst Field -->
          <q-input
            outlined
            v-model="viewModel.analyst"
            label="Analyst"
            bg-color="card-bg"
            color="secondary"
            label-color="forecolor1"
          />
        </q-card-section>
      </q-card>
    </div>

    <!-- Lower Section - Remarks -->
    <div v-show="!showSpinner" class="row q-px-md q-pb-md" style="flex: 1;">
      <q-card class="col" flat bordered>
        <q-card-section class="bg-secondary text-primary">
          <div class="text-caption">Remarks</div>
        </q-card-section>
        <q-separator color="card-bar" size="2px"/>
        <q-card-section>
          <q-editor
            v-model="viewModel.remarks"
            min-height="200px"
            :toolbar="[
              ['bold', 'italic', 'underline'],
              ['unordered', 'ordered'],
              ['undo', 'redo']
            ]"
            content-class="bg-card-bg text-forecolor1"
          />
        </q-card-section>
      </q-card>
    </div>

    <div v-show="showSpinner" class="row q-pa-md">
      <div 
      class="col-12 q-pa-sm absolute-center flex flex-center">
          <q-spinner
              color="secondary"
              :size="spinnerSize"
              :thickness="spinnerThickness"
          />
      </div>
    </div>

  </q-page>
</template>

<script>
import Toolbox from 'src/components/headers/CustomToolBox.vue';
import { fetchFields } from "src/api_services/assets_service";
import { fetchDCAOptions } from "src/api_services/dca_service";

export default {
  components: {
    Toolbox
  },
  data() {
    return {
      showSpinner: true,
      spinnerSize: "8em",
      spinnerThickness: 10,
      toolboxButtons: [
        {
          icon: 'save',
          tooltip: 'Save',
          handler: this.saveData,
          class: 'text-secondary'
        },
        {
          icon: 'cancel',
          tooltip: 'Cancel',
          handler: this.cancelChanges,
          class: 'text-secondary'
        },
      ],
      viewModel: {
          reservoirFluid: null,
          model: null,
          referenceDate: new Date().toISOString().substr(0, 10),
          company: null,
          field: null,
          location: null,
          platform: null,
          analyst: null,
          remarks: ''
      },
      reservoirOptions: ['Oil', 'Gas', 'Ret. condensate'],
      modelOptions: ['By Well', 'By Reservoir'],
      fieldOptions: [],
    }
  },
  methods: {
    saveData() {
      // Save logic
    },
    cancelChanges() {
      // Cancel logic
    },
    printData() {
      // Print logic
    }
  },
  created(){

    this.showSpinner = true;

    this.fieldOptions = fetchFields().map(field => field.label);

    const dcaOptions = fetchDCAOptions();

    this.viewModel = { ...dcaOptions }

    this.showSpinner = false;
  }
}
</script>

<style>
/* Hide scrollbar but allow scrolling */
body::-webkit-scrollbar {
  display: none;
}

body {
  -ms-overflow-style: none;
  scrollbar-width: none;
  background-color: var(--q-primary);
}

.q-page {
  scrollbar-width: none;
}

.q-page::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>