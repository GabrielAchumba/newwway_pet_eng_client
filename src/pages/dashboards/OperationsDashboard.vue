<template>
    <!-- <q-page class="q-pa-md bg-grey-1 scroll" style="scrollbar-width: none;"></q-page> -->
  <q-page padding class="bg-forecolor1 scroll" style="scrollbar-width: none; height: 80vh;">
    <!-- Upper Section - KPI Cards -->
    <div class="row q-col-gutter-md q-mb-xl">
      <div v-for="(card, index) in cards" :key="index" class="col-12 col-md-4">
        <q-card class="card-custom row items-center q-pa-md shadow-2 bordered">
          <q-img :src="card.image" style="width: 64px; height: 64px" class="q-mr-md" />
          <div>
            <div class="text-caption text-forecolor1">{{ card.title }}</div>
            <div class="text-h6 text-secondary">{{ card.value }}</div>
            <div class="text-caption text-forecolor1">{{ card.description }}</div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Charts -->
    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12 col-md-6">
        <q-card class="q-pa-md">
          <div class="text-subtitle1 text-secondary q-mb-md">Planned vs Drilled Wells by Month</div>
          <div ref="drillingChart" style="height: 250px"></div>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card class="q-pa-md">
          <div class="text-subtitle1 text-secondary q-mb-md">Downtime by Cause</div>
          <div ref="downtimeChart" style="height: 250px"></div>
        </q-card>
      </div>

      <div class="col-12">
        <q-card class="q-pa-md">
          <div class="text-subtitle1 text-secondary q-mb-md">Mean Time Between Failure (MTBF)</div>
          <div ref="mtbfChart" style="height: 250px"></div>
        </q-card>
      </div>
    </div>

    <!-- Maintenance Table -->
    <q-card class="q-pa-md">
      <div class="text-subtitle1 text-secondary q-mb-md">Shutdown/Maintenance Plans</div>
      <q-table
        flat bordered
        :rows="tableRows"
        row-key="equipment"
        :columns="columns"
        class="text-secondary"
      />
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Plotly from 'plotly.js-dist-min';
import { usePropertyGridStore } from 'src/store/modules/propertyGridStore';
import NumberofWellsOnlineImage from 'src/assets/images/Rampup.svg';
import RigUtilizationImage from 'src/assets/images/Reroute.svg';
import DowntimeHoursImage from 'src/assets/images/ResultCharts.svg';
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';

const cards = [
  {
    title: 'Number of Wells Online',
    value: '120 Wells',
    description: 'Operational activity',
    image: NumberofWellsOnlineImage
  },
  {
    title: 'Rig Utilization',
    value: '85%',
    description: 'Drilling efficiency',
    image: RigUtilizationImage
  },
  {
    title: 'Downtime Hours',
    value: '13 hrs (Today)',
    description: 'Maintenance impact',
    image: DowntimeHoursImage
  }
];

const drillingChart = ref(null);
const downtimeChart = ref(null);
const mtbfChart = ref(null);
const propertyGridStore = usePropertyGridStore();
const assetsExplorerStore = useAssetsExplorerStore();

const drillingData = [
  { month: 'Jan', planned: 10, drilled: 8 },
  { month: 'Feb', planned: 12, drilled: 11 },
  { month: 'Mar', planned: 15, drilled: 13 }
];

const downtimeData = [
  { name: 'Mechanical', value: 40 },
  { name: 'Electrical', value: 30 },
  { name: 'HSE', value: 30 }
];

const mtbfData = [
  { day: 'Mon', hours: 15 },
  { day: 'Tue', hours: 18 },
  { day: 'Wed', hours: 14 },
  { day: 'Thu', hours: 20 },
  { day: 'Fri', hours: 17 }
];

const tableRows = [
  { equipment: 'Pump A1', workType: 'Inspection', status: 'Scheduled', start: '2025-08-10', end: '2025-08-12', impact: 'Low' },
  { equipment: 'Valve B2', workType: 'Repair', status: 'In Progress', start: '2025-08-05', end: '2025-08-09', impact: 'High' }
];

const columns = [
//     {
//     name: 'equipment',
//     required: true,
//     label: 'Equipment',
//     align: 'left',
//     field: row => row.equipment,
//     format: val => `${val}`,
//     sortable: true,
//     headerClasses: 'bg-primary text-white'
//   }
  { 
    name: 'equipment', 
    required: true, 
    label: 'Equipment', 
    align: 'left', 
    field: 'equipment',
    headerClasses: 'bg-secondary text-white'
  },
  { name: 'workType', label: 'Work Type', align: 'left', field: 'workType', headerClasses: 'bg-secondary text-white' },
  { name: 'status', label: 'Status', align: 'left', field: 'status', headerClasses: 'bg-secondary text-white' },
  { name: 'start', label: 'Start', align: 'left', field: 'start', headerClasses: 'bg-secondary text-white' },
  { name: 'end', label: 'End', align: 'left', field: 'end', headerClasses: 'bg-secondary text-white' },
  { name: 'impact', label: 'Impact', align: 'left', field: 'impact', headerClasses: 'bg-secondary text-white' }
];

onMounted(() => {
  Plotly.newPlot(drillingChart.value, [
    {
      x: drillingData.map(d => d.month),
      y: drillingData.map(d => d.planned),
      name: 'Planned',
      type: 'bar',
      marker: { color: '#0A1D3F' }
    },
    {
      x: drillingData.map(d => d.month),
      y: drillingData.map(d => d.drilled),
      name: 'Drilled',
      type: 'bar',
      marker: { color: '#E2372D' }
    }
  ], { barmode: 'group', margin: { t: 20 } });

  Plotly.newPlot(downtimeChart.value, [
    {
      labels: downtimeData.map(d => d.name),
      values: downtimeData.map(d => d.value),
      type: 'pie',
      marker: { colors: ['#0A1D3F', '#E2372D', '#475569'] },
      textinfo: 'label+percent'
    }
  ], { margin: { t: 20 } });

  Plotly.newPlot(mtbfChart.value, [
    {
      x: mtbfData.map(d => d.day),
      y: mtbfData.map(d => d.hours),
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#E2372D' },
      name: 'MTBF Hours'
    }
  ], { margin: { t: 20 } });

  propertyGridStore.SetIsPropertyGridActivated(false);
  assetsExplorerStore.SetIsAssetsExplorerActivated(false);
});
</script>

<style lang="scss" scoped>
.card-custom {
  border-left: 4px solid $card-bar;
}
</style>