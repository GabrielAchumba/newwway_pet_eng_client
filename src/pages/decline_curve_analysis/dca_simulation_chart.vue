<template>
  <q-page class="dca-simulation-chart">
    <Toolbox :buttons="toolboxButtons" />
    <div ref="plotlyChart" class="plotly-container"></div>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import Plotly from 'plotly.js-dist-min'
import Toolbox from 'src/components/headers/CustomToolBox.vue';

export const productionHistory = Array(500).fill().map((_, i) => ({
  time: i <= 500 ? new Date(Date.now() - (2000 - i) * 86400000).toISOString().substr(0, 10) : "",
  oilRate: i <= 500 ? (1500 + Math.random() * 2000) : null,
  oilRateCalc: i <= 500 ? (1500 + Math.random() * 2000) : null
}))

export default {
  setup() {

    const toolboxButtons = [
        {
          icon: 'save',
          tooltip: 'Save',
          handler: () => {},
          class: 'text-secondary'
        },
        {
          icon: 'cancel',
          tooltip: 'Cancel',
          handler: () => {},
          class: 'text-secondary'
        },
        {
          icon: 'table',
          tooltip: 'Plot', // Plot on calcuted DCA
          handler: () => {},
          class: 'text-secondary'
        }
    ];
    const plotlyChart = ref(null)

    onMounted(() => {
      renderChart()
    })

    const renderChart = () => {
      const filteredData = productionHistory.filter(item => item.time !== "")
      
      const trace1 = {
        x: filteredData.map(item => item.time),
        y: filteredData.map(item => item.oilRate),
        name: 'Oil Rate',
        mode: 'markers',
        marker: {
          size: 4,
          color: '#E2372D' // Using your accent color
        },
        type: 'scatter'
      }

      const trace2 = {
        x: filteredData.map(item => item.time),
        y: filteredData.map(item => item.oilRateCalc),
        name: 'Calculated Oil Rate',
        mode: 'lines',
        line: {
          shape: 'spline',
          width: 2,
          color: '#0A1D3F' // Using your secondary color
        },
        type: 'scatter'
      }

      const layout = {
        title: 'DCA Simulation',
        xaxis: {
          title: 'Date',
          type: 'date',
          showgrid: true,
          gridcolor: '#E0E0E0',
          gridwidth: 1,
          zeroline: false
        },
        yaxis: {
          title: 'Oil Rate (STB/day)',
          showgrid: true,
          gridcolor: '#E0E0E0',
          gridwidth: 1,
          zeroline: false
        },
        plot_bgcolor: '#FFFFFF', // Using your primary color
        paper_bgcolor: '#FFFFFF', // Using your primary color
        margin: {
          l: 60,
          r: 40,
          b: 60,
          t: 80,
          pad: 4
        },
        showlegend: true,
        legend: {
          orientation: 'h',
          y: 1.1
        }
      }

      const config = {
        responsive: true,
        displayModeBar: true
      }

      Plotly.newPlot(plotlyChart.value, [trace1, trace2], layout, config)
    }

    return {
      plotlyChart,
      toolboxButtons
    }
  }
}
</script>

<style lang="scss">
.dca-simulation-chart {
  background-color: $primary;
  height: 100vh;
  width: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;

  .plotly-container {
    flex: 1;
    width: 100%;
    min-height: 0; // Important for proper sizing in flex container
  }
}
</style>