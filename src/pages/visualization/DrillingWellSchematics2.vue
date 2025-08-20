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

const propertyGridStore = usePropertyGridStore();
const assetsExplorerStore = useAssetsExplorerStore();

const plotEl = ref(null)
let resizeHandler

onMounted(async () => {

  propertyGridStore.SetIsPropertyGridActivated(true);
  assetsExplorerStore.SetIsAssetsExplorerActivated(true);
  // Empty (invisible) trace just to establish a 100x100 canvas
  const data = [
    {
      x: [0, 100],
      y: [0, 100],
      mode: 'markers',
      opacity: 0,
      hoverinfo: 'skip',
      showlegend: false,
    },
  ]

  const layout = {
    title: '100 × 100 axes (Y inverted) with 50×20 rectangle',
    xaxis: {
      range: [0, 100],
      zeroline: true,
      mirror: true,
      ticks: 'outside',
      showgrid: true,
    },
    yaxis: {
      range: [0, 100],
      autorange: 'reversed', // invert Y-axis
      zeroline: true,
      mirror: true,
      ticks: 'outside',
      showgrid: true,
    },
    shapes: [
      {
        type: 'rect',
        x0: 30, // left
        y0: 30, // top (because y is inverted)
        x1: 20, // length along X
        y1: 50, // width along Y
        line: { width: 2 },
        fillcolor: 'blue', //'rgba(0,0,0,0)', // transparent fill
      },
    ],
    margin: { l: 50, r: 20, t: 60, b: 50 },
  }

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