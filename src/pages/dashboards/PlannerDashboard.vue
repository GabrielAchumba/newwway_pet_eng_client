<template>
  <q-page class="bg-forecolor1 q-pa-md scroll" style="scrollbar-width: none; height: 80vh;">
    <!-- KPI Cards class="row q-col-gutter-md q-mb-lg"   "q-gutter-md row q-col-gutter-md"-->

    <div class="row q-col-gutter-md q-mb-lg">
      <div
        v-for="(card, index) in kpiData"
        :key="index"
        class="col-xs-12 col-sm-6 col-md-4"
      >
        <q-card class="q-pa-md bg-white shadow-2 card-custom">
          <div class="row items-center q-gutter-sm">
            <q-img :src="card.image" contain style="height: 48px; width: 48px" />
            <div>
              <div class="text-subtitle2 text-forecolor1">{{ card.title }}</div>
              <div class="text-h6 text-secondary">{{ card.value }}</div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Charts -->
    <div class="q-mt-xl row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card class="q-pa-md">
          <div class="text-h6 q-mb-md text-secondary">Daily Oil, Gas & Water Production</div>
          <div ref="lineChart" style="height: 300px"></div>
        </q-card>
      </div>
      <div class="col-12 col-md-6">
        <q-card class="q-pa-md">
          <div class="text-h6 q-mb-md text-secondary">Monthly Production per Asset</div>
          <div ref="barChart" style="height: 300px"></div>
        </q-card>
      </div>
      <div class="col-12">
        <q-card class="q-pa-md">
          <div class="text-h6 q-mb-md text-secondary">Actual vs Forecasted Volumes</div>
          <div ref="areaChart" style="height: 300px"></div>
        </q-card>
      </div>
    </div>

    <!-- Tables -->
    <div class="q-mt-xl q-gutter-y-md">
      <!-- Wells Table -->
      <q-card class="q-pa-md">
        <div class="text-h6 q-mb-md text-secondary">Wells Table</div>
        <q-markup-table>
          <thead class="bg-secondary text-white">
            <tr>
              <th>Well</th>
              <th>Status</th>
              <th>Last Prod Date</th>
              <th>Oil Rate (BOPD)</th>
              <th>Water Cut (%)</th>
              <th>Gas Rate (MSCFD)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(w, i) in wells" :key="i">
              <td>{{ w.well }}</td>
              <td>{{ w.status }}</td>
              <td>{{ w.date }}</td>
              <td>{{ w.oil }}</td>
              <td>{{ w.water }}</td>
              <td>{{ w.gas }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card>

      <!-- Deviation Table -->
      <q-card class="q-pa-md">
        <div class="text-h6 q-mb-md text-secondary">Forecast Deviation Table</div>
        <q-markup-table>
          <thead class="bg-secondary text-white">
            <tr>
              <th>Period</th>
              <th>Forecast (BOPD)</th>
              <th>Actual</th>
              <th>Deviation (%)</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(d, i) in deviations" :key="i">
              <td>{{ d.period }}</td>
              <td>{{ d.forecast }}</td>
              <td>{{ d.actual }}</td>
              <td>{{ d.deviation }}</td>
              <td>{{ d.reason }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted,  ref } from 'vue';
import Plotly from 'plotly.js-dist-min';
import DailyOilProductionImage from 'assets/images/Oil.svg';
import MonthlyProductionForecastImage from 'assets/images/QualityAssurance.svg';
import EmissionsImage from 'assets/images/StoredDeck.svg';
import { usePropertyGridStore } from 'src/store/modules/propertyGridStore';
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';

const lineChart = ref(null);
const barChart = ref(null);
const areaChart = ref(null);
const propertyGridStore = usePropertyGridStore();
const assetsExplorerStore = useAssetsExplorerStore();

const kpiData = [
  { title: 'Daily Oil Production', value: '75,000 BOPD', image: DailyOilProductionImage },
  { title: 'Monthly Production Forecast', value: '2.1 MMSTB', image: MonthlyProductionForecastImage },
  { title: 'Emissions (CO₂e)', value: '9,000 tons', image: EmissionsImage },
];

const sampleLineData = [
  { date: 'Mon', oil: 75000, gas: 12000, water: 5000 },
  { date: 'Tue', oil: 76000, gas: 11500, water: 5100 },
  { date: 'Wed', oil: 74000, gas: 13000, water: 4900 },
];

const sampleBarData = [
  { asset: 'Field A', prod: 80000 },
  { asset: 'Field B', prod: 60000 },
  { asset: 'Field C', prod: 70000 },
];

const sampleAreaData = [
  { month: 'Jan', actual: 2.0, forecast: 3.1 },
  { month: 'Feb', actual: 2.05, forecast: 5.0 },
];

const wells = [
  { well: 'Well 1', status: 'Active', date: '2025-08-01', oil: 2500, water: 30, gas: 1200 },
  { well: 'Well 2', status: 'Shut-in', date: '2025-07-28', oil: 0, water: 0, gas: 0 },
];

const deviations = [
  { period: 'Aug', forecast: 75000, actual: 73000, deviation: -2.67, reason: 'Pump issue' },
];

onMounted(() => {
  Plotly.newPlot(lineChart.value, [
    { x: sampleLineData.map(d => d.date), y: sampleLineData.map(d => d.oil), type: 'scatter', name: 'Oil', line: { color: '#E2372D' } },
    { x: sampleLineData.map(d => d.date), y: sampleLineData.map(d => d.gas), type: 'scatter', name: 'Gas', line: { color: '#0A1D3F' } },
    { x: sampleLineData.map(d => d.date), y: sampleLineData.map(d => d.water), type: 'scatter', name: 'Water', line: { color: '#475569' } },
  ]);

  Plotly.newPlot(barChart.value, [
    { x: sampleBarData.map(d => d.asset), y: sampleBarData.map(d => d.prod), type: 'bar', marker: { color: '#E2372D' }, name: 'Production' },
  ]);

  Plotly.newPlot(areaChart.value, [
    { x: sampleAreaData.map(d => d.month), y: sampleAreaData.map(d => d.forecast), type: 'scatter', fill: 'tozeroy', name: 'Forecast', line: { color: '#E2372D' } },
    { x: sampleAreaData.map(d => d.month), y: sampleAreaData.map(d => d.actual), type: 'scatter', fill: 'tozeroy', name: 'Actual', line: { color: '#0A1D3F' } },
  ]);
  propertyGridStore.SetIsPropertyGridActivated(false);
  assetsExplorerStore.SetIsAssetsExplorerActivated(false);
});

</script>

<style lang="scss" scoped>
.card-custom {
  border-left: 4px solid $card-bar;
}
</style>