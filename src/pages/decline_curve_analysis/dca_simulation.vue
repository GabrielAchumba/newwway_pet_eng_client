<template>
  <q-page class="column no-wrap" style="height: 100vh; overflow-y: auto;">
    <toolbox v-show="!showSpinner" :buttons="toolboxButtons" />
    <!-- Upper Section - Form Fields -->
    <div v-show="!showSpinner" class="row q-pa-md">
      <div class="col-12">
        <div class="row q-col-gutter-md">
          
          <!-- Description -->
          <div class="col-md-6 col-xs-12">
            <q-input
              outlined
              v-model="viewModel.description"
              label="Description"
              bg-color="card-bg"
              color="secondary"
              label-color="forecolor1"
            />
          </div>
          
          <!-- Decline -->
          <div class="col-md-6 col-xs-12">
            <q-select
              outlined
              v-model="viewModel.decline"
              :options="declineOptions"
              label="Decline"
              bg-color="card-bg"
              color="secondary"
              label-color="forecolor1"
            />
          </div>
          
          <!-- Production Start -->
          <div class="col-md-6 col-xs-12">
            <q-input
              outlined
              v-model="viewModel.productionStart"
              label="Production Start"
              bg-color="card-bg"
              color="secondary"
              label-color="forecolor1"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date 
                      v-model="viewModel.productionStart"
                      mask="YYYY-MM-DD"
                      color="secondary"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          
          <!-- Abandonment Rate -->
          <div class="col-md-6 col-xs-12">
            <q-input
              outlined
              v-model="viewModel.abandonmentRate"
              label="Abandonment Rate"
              type="number"
              bg-color="card-bg"
              color="secondary"
              label-color="forecolor1"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Lower Section - Tables -->
    <div v-show="!showSpinner" class="row q-pa-md q-col-gutter-md" style="flex: 1;">
      <!-- Decline Rates Table -->
      <div class="col-md-6 col-xs-12">
        <q-card flat bordered>
          <q-card-section class="bg-secondary text-primary">
            <div class="text-caption">Decline Rates</div>
          </q-card-section>
          <q-separator color="card-bar" size="2px"/>
          <q-card-section style="height: 400px; overflow-y: auto;">
            <q-table
              flat
              bordered
              :rows="viewModel.declineRates"
              :columns="declineRateColumns"
              row-key="id"
              hide-pagination
              virtual-scroll
              :rows-per-page-options="[0]"
              style="height: 350px;"
              class="sticky-header-table bordered-table"
              :wrap-cells="true"
            >
              <template v-slot:body-cell="props">
                <q-td :props="props">
                  <q-input
                    v-model="props.row[props.col.field]"
                    borderless
                    dense
                    @update:model-value="updateDeclineRate(props.rowIndex, props.col.field, $event)"
                  />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>

      <!-- Production History Table -->
      <div class="col-md-6 col-xs-12">
        <q-card flat bordered>
          <q-card-section class="bg-secondary text-primary">
            <div class="text-caption">Production History</div>
          </q-card-section>
          <q-separator color="card-bar" size="2px"/>
          <q-card-section style="height: 400px; overflow-y: auto;">
            <q-table
                flat
                bordered
                :rows="productionHistory"
                :columns="productionHistoryColumns"
                row-key="id"
                hide-pagination
                virtual-scroll
                :rows-per-page-options="[0]"
                style="height: 350px;"
                class="sticky-header-table bordered-table"
                :wrap-cells="true"
                >
                <template v-slot:body-cell="props">
                    <q-td :props="props">
                    <q-input
                        v-model="props.row[props.col.field]"
                        borderless
                        dense
                        @update:model-value="updateProductionHistory(props.rowIndex, props.col.field, $event)"
                    />
                    </q-td>
                </template>
                </q-table>
          </q-card-section>
        </q-card>
      </div>
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
import { usePropertyGridStore } from 'src/store/modules/propertyGridStore';
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';
import { fetchProductionHistory } from "src/api_services/production_analysis_services";
import { fetchDCASimuationAssetExplorer } from "src/api_services/dca_service";

const propertyGridStore = usePropertyGridStore();
const assetsExplorerStore = useAssetsExplorerStore();

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
          handler: this.plotDCASimulation,
          class: 'text-secondary'
        },
        {
          icon: 'cancel',
          tooltip: 'Cancel',
          handler: this.plotDCASimulation,
          class: 'text-secondary'
        },
        {
          icon: 'line_axis',
          tooltip: 'Plot', // Plot on calcuted DCA
          handler: this.plotDCASimulation,
          class: 'text-secondary'
        },
        {
          icon: 'play_arrow',
          tooltip: 'Calculate', // Calculate and plot calculated DCA and production history
          handler: this.plotDCASimulation,
          class: 'text-secondary'
        },
        // Add more buttons as needed
        {
          icon: 'stacked_line_chart',
          tooltip: 'Match', // Regress and plot calculated DCA and production history
          handler: this.plotDCASimulation,
          class: 'text-secondary'
        }
      ],
      viewModel: {},
      declineOptions: ['Exponential', 'Harmonic', 'Hyperbolic'],
      // Decline Rates Table
      declineRateColumns: [
        { name: 'time', label: 'Prod. Date (yyyy-d-m)', field: 'time', align: 'left',  headerClasses: 'bg-secondary text-white' },
        { name: 'initialRate', label: 'Initial Rate (STB/day)', field: 'initialRate', align: 'left',  headerClasses: 'bg-secondary text-white' },
        { name: 'declineRate', label: 'Decline Rate (1/day)', field: 'declineRate', align: 'left',  headerClasses: 'bg-secondary text-white' },
        { name: 'exponent', label: 'Exponent', field: 'exponent', align: 'left',  headerClasses: 'bg-secondary text-white' }
      ],

      // Production History Table
      productionHistoryColumns: [
        { name: 'time', label: 'Prod. Date (yyyy-d-m)', field: 'time', align: 'left',  headerClasses: 'bg-secondary text-white' },
        { name: 'oilRate', label: 'Oil Rate (STB/day)', field: 'oilRate', align: 'left',  headerClasses: 'bg-secondary text-white' },
        { name: 'oilRateCalc', label: 'Oil Rate Calc. (STB/day)', field: 'oilRateCalc', align: 'left',  headerClasses: 'bg-secondary text-white' }
      ],
      productionHistory: []
    }
  },
  methods: {
    updateDeclineRate(index, field, value) {
      this.declineRates[index][field] = value;
    },
    updateProductionHistory(index, field, value) {
      this.productionHistory[index][field] = value;
    },
    plotDCASimulation() {
      this.$router.push('/dca-simulation-chart');
    },
  },
  created(){

    this.showSpinner = true;

    const dcaSimuationAssetExplorer = fetchDCASimuationAssetExplorer();
    console.log("dcaSimuationAssetExplorer:", dcaSimuationAssetExplorer)
    this.viewModel = { 
      ...dcaSimuationAssetExplorer[0],
      declineRates: dcaSimuationAssetExplorer[0].declineRates.map((row) => ({
        ...row,
        initialRate: row.initialRate ? Number(row.initialRate).toFixed(2) : null,
        declineRate: row.declineRate ? Number(row.declineRate).toFixed(6) : null,
        exponent: row.exponent ? Number(row.exponent).toFixed(2) : null,
      }))
    }

    const productionHistoryData = fetchProductionHistory();
    this.productionHistory = productionHistoryData.map((row, i) => ({
        id: i,
        ...row,
        oilRate: Number(row.oilRate).toFixed(2),
        oilRateCalc:  Number(row.oilRateCalc).toFixed(2)
      }))

    propertyGridStore.SetIsPropertyGridActivated(false);
    assetsExplorerStore.SetIsAssetsExplorerActivated(true);
    assetsExplorerStore.setStateData("listItems", dcaSimuationAssetExplorer.map((row=>({
      label: row.label,
      checked: false
    }))));

    assetsExplorerStore.setStateData("isCheckBoxActive", true);

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

/* Table styling */
.q-table__container {
  box-shadow: none;
}

.q-table__top {
  padding: 0;
}

.q-table thead tr, .q-table tbody td {
  height: 40px;
}

.q-table tbody tr:hover {
  background-color: var(--q-selected-list-item);
}

/* Sticky header with grid lines */
.sticky-header-table.bordered-table {
  display: flex;
  flex-direction: column;
  border-collapse: collapse;
}

/* Sticky header styles */
.sticky-header-table .q-table__top,
.sticky-header-table .q-table__bottom,
.sticky-header-table thead tr:first-child th {
  background-color: #0A1D3F; /* Your secondary color */
  color: white; /* Text color for headers */
  position: sticky;
  z-index: 2; /* Higher than cell borders */
}

.sticky-header-table thead tr:first-child th {
  top: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.sticky-header-table .q-table__middle {
  flex: 1;
  overflow-y: auto;
}

/* Vertical and horizontal grid lines */
.bordered-table thead tr th,
.bordered-table tbody tr td {
  border-left: 1px solid rgba(10, 29, 63, 0.2); /* Secondary color with 20% opacity */
  border-right: 1px solid rgba(10, 29, 63, 0.2);
  border-bottom: 1px solid rgba(10, 29, 63, 0.2);
}

/* Remove left border from first cell and right border from last cell */
.bordered-table thead tr th:first-child,
.bordered-table tbody tr td:first-child {
  border-left: none;
}

.bordered-table thead tr th:last-child,
.bordered-table tbody tr td:last-child {
  border-right: none;
}

/* Cell padding */
.cell-borders {
  padding: 4px 8px !important;
}
</style>