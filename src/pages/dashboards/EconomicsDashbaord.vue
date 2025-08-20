<template>
  <q-page padding class="bg-forecolor1 scroll" style="scrollbar-width: none; height: 80vh;">
    <!-- KPI Cards -->

    <div class="row q-col-gutter-md q-mb-lg">
        <div
            v-for="(card, index) in kpiData"
            :key="index"
            class="col-12 col-md-6"
        >
            <q-card class="card-custom q-pa-md row items-center shadow-2 bordered">
            <q-img :src="card.image" style="width: 64px; height: 64px" class="q-mr-md" />
            <div>
                <div class="text-forecolor1 text-caption">{{ card.title }}</div>
                <div class="text-h6 text-secondary">{{ card.value }}</div>
            </div>
            </q-card>
        </div>
    </div>

    <!-- Charts -->

    <div class="row q-col-gutter-md q-mt-lg">
        <div class="col-12 col-md-6">
            <q-card class="q-pa-md">
            <div class="text-subtitle1 text-secondary q-mb-md">NPV Trend per Project</div>
            <div id="npvChart" style="height: 250px"></div>
            </q-card>
        </div>

        <div class="col-12 col-md-6">
            <q-card class="q-pa-md">
            <div class="text-subtitle1 text-secondary q-mb-md">CAPEX / OPEX Breakdown</div>
            <div id="capexOpexChart" style="height: 250px"></div>
            </q-card>
        </div>
    </div>

    <!-- Project Status Table -->
    <div class="q-mt-lg">
      <q-card class="q-pa-md">
        <div class="text-subtitle1 text-secondary q-mb-md">Project Status</div>
        <q-table
          :rows="projects"
          :columns="[
            { name: 'name', label: 'Project Name', field: 'name', align: 'left', headerClasses: 'bg-secondary text-white' },
            { name: 'phase', label: 'Phase', field: 'phase', align: 'left', headerClasses: 'bg-secondary text-white' },
            { name: 'npv', label: 'NPV ($M)', field: 'npv', align: 'left', headerClasses: 'bg-secondary text-white' },
            {
              name: 'progress',
              label: 'Progress (%)',
              field: 'progress',
              align: 'left',
              format: val => `${val}%`,
              headerClasses: 'bg-secondary text-white'
            },
            { name: 'endDate', label: 'Planned End Date', field: 'endDate', align: 'left', headerClasses: 'bg-secondary text-white' }
          ]"
          row-key="name"
        >
          <template v-slot:body-cell-progress="props">
            <q-td :props="props">
              <q-linear-progress :value="props.row.progress / 100" color="negative" track-color="grey-3" size="sm" rounded />
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import Plotly from 'plotly.js-dist-min';
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';

import NPVofActiveProjectsImage from 'src/assets/images/QuicklookEvaluation.svg';
import CAPEXYTDImage from 'src/assets/images/ProfitTax.svg';
import { usePropertyGridStore } from 'src/store/modules/propertyGridStore';
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';

const $q = useQuasar();
const propertyGridStore = usePropertyGridStore();
const assetsExplorerStore = useAssetsExplorerStore();

const kpiData = [
  {
    title: 'NPV of Active Projects',
    value: '$480 million',
    image: NPVofActiveProjectsImage,
  },
  {
    title: 'CAPEX YTD',
    value: '₦2.4 Billion',
    image: CAPEXYTDImage,
  },
];

const npvTrendData = [
  { project: 'A', npv: 120 },
  { project: 'B', npv: 200 },
  { project: 'C', npv: 160 },
  { project: 'D', npv: 250 },
];

const capexOpexData = [
  { department: 'Ops', capex: 100, opex: 150 },
  { department: 'Eng', capex: 80, opex: 120 },
  { department: 'Admin', capex: 60, opex: 90 },
];

const projects = [
  { name: 'Project A', phase: 'Execution', npv: '$120M', progress: 80, endDate: '2025-12-20' },
  { name: 'Project B', phase: 'Planning', npv: '$200M', progress: 40, endDate: '2026-06-15' },
  { name: 'Project C', phase: 'Feasibility', npv: '$160M', progress: 30, endDate: '2025-09-10' },
];

const initNPVChart = () => {
  Plotly.newPlot('npvChart', [{
    x: npvTrendData.map(item => item.project),
    y: npvTrendData.map(item => item.npv),
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#E2372D', width: 3 },
  }], {
    margin: { t: 20 },
  }, { responsive: true });
};

const initCapexOpexChart = () => {
  Plotly.newPlot('capexOpexChart', [
    {
      x: capexOpexData.map(item => item.department),
      y: capexOpexData.map(item => item.capex),
      name: 'CAPEX',
      type: 'bar',
      marker: { color: '#0A1D3F' },
    },
    {
      x: capexOpexData.map(item => item.department),
      y: capexOpexData.map(item => item.opex),
      name: 'OPEX',
      type: 'bar',
      marker: { color: '#E2372D' },
    }
  ], {
    barmode: 'stack',
    margin: { t: 20 },
  }, { responsive: true });
};

onMounted(() => {
  initNPVChart();
  initCapexOpexChart();
  propertyGridStore.SetIsPropertyGridActivated(false);
  assetsExplorerStore.SetIsAssetsExplorerActivated(false);
});
</script>

<style lang="scss" scoped>
.card-custom {
  border-left: 4px solid $card-bar;
}
</style>