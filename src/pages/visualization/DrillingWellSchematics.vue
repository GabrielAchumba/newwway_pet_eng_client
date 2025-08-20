<template>
  <q-page class="q-pa-md">
    <div class="text-h6 q-mb-md">Plotly Rectangle (height 50 × width 20)</div>
    <div ref="plotEl" style="width: 100%; max-width: 900px; height: 520px;"></div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Plotly from 'plotly.js-dist-min'
import { usePropertyGridStore } from 'src/store/modules/propertyGridStore';
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';
import { 
    calculateCenters,
    getRotatedPath,
    calculateXYAxesLimits
} from 'src/app_utils/visualizations/draw_drilling_schematics';

const propertyGridStore = usePropertyGridStore();
const assetsExplorerStore = useAssetsExplorerStore();

const plotEl = ref(null)
let resizeHandler

onMounted(async () => {

  propertyGridStore.SetIsPropertyGridActivated(true);
  assetsExplorerStore.SetIsAssetsExplorerActivated(true);

  const wellAccessories = calculateCenters();
  console.log("wellAccessories: ", wellAccessories);
  const { xAxisLimit, yAxisLimit } = calculateXYAxesLimits(wellAccessories[wellAccessories.length-1]);
  console.log("{ xAxisLimit, yAxisLimit }: ", { xAxisLimit, yAxisLimit });

  // Empty (invisible) trace just to establish a 100x100 canvas
  const data = [
    {
      x: [0, xAxisLimit],
      y: [0, yAxisLimit],
      mode: 'markers',
      opacity: 0,
      hoverinfo: 'skip',
      showlegend: false,
    },
  ]

    const layout = {
    title: 'Well Schematics',
    xaxis: {
        range: [0, xAxisLimit],
        zeroline: true,
        mirror: true,
        ticks: 'outside',
        showgrid: true,
        scaleanchor: 'y',
    },
    yaxis: {
        range: [0, yAxisLimit],
        autorange: 'reversed', // invert Y-axis
        zeroline: true,
        mirror: true,
        ticks: 'outside',
        showgrid: true,
        scaleratio: 1,
    },
    shapes: wellAccessories.map((pipe, idx) => ({
        type: 'path',
        path: getRotatedPath(pipe.cx, pipe.cy, pipe.width, pipe.length, pipe.inclination),
        fillcolor: `rgba(${50+idx*50}, 100, 200, 0.5)`,
        line: { color: 'black', width: 2 }
    })),
    margin: { l: 50, r: 20, t: 60, b: 50 },
 };

  const config = { responsive: true, displayModeBar: true }

  await Plotly.newPlot(plotEl.value, data, layout, config)

  // Keep chart responsive
  resizeHandler = () => Plotly.Plots.resize(plotEl.value)
  window.addEventListener('resize', resizeHandler)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
  if (plotEl.value) Plotly.purge(plotEl.value)
})
</script>

<style scoped>
</style>