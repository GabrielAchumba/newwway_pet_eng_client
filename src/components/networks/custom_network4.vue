<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Main network visualization area -->
      <div class="col-10">
        <q-card class="custom-card">
          <q-card-section>
            <div class="row items-center q-mb-md">
              <div class="col"></div>
              <div class="col-auto">
                <q-btn-group flat>
                  <q-btn icon="zoom_in" @click="zoomIn" flat>
                    <q-tooltip>Zoom In</q-tooltip>
                  </q-btn>
                  <q-btn icon="zoom_out" @click="zoomOut" flat>
                    <q-tooltip>Zoom Out</q-tooltip>
                  </q-btn>
                  <q-btn icon="zoom_out_map" @click="fitView" flat>
                    <q-tooltip>Fit View</q-tooltip>
                  </q-btn>
                </q-btn-group>
              </div>
            </div>

            <div class="network-container">
              <div id="surfaceNetwork" style="width: 100%; height: 100%;"></div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Legend section on the right -->
      <div class="col-2">
        <q-card class="custom-card">
          <q-card-section>
            <div class="text-h6">Legend</div>
          </q-card-section>
          <q-card-section>
            <div class="column q-gutter-md">
              <div class="legend-item">
                <img :src="drainagePoint" alt="Well" class="legend-img" />
                <span class="text-caption">Well</span>
              </div>
              <div class="legend-item">
                <img :src="flowstation" alt="Facility" class="legend-img" />
                <span class="text-caption">Facility</span>
              </div>
              <div class="legend-item">
                <img :src="centralProcessingFacility" alt="CPF" class="legend-img" />
                <span class="text-caption">Central Processing Facility</span>
              </div>
              <div class="legend-item">
                <img :src="gasProcessingFacility" alt="GPF" class="legend-img" />
                <span class="text-caption">Gas Processing Facility</span>
              </div>
              <div class="legend-item">
                <img :src="pipeline" alt="Pipeline" class="legend-img" />
                <span class="text-caption">Pipeline</span>
              </div>
              <div class="legend-item">
                <img :src="dehydrationUnit" alt="Dehydration Unit" class="legend-img" />
                <span class="text-caption">Dehydration Unit</span>
              </div>
              <div class="legend-item">
                <img :src="gasDemand" alt="Gas Customer" class="legend-img" />
                <span class="text-caption">Gas Customer</span>
              </div>
              <div class="legend-item">
                <img :src="terminal" alt="FCOT" class="legend-img" />
                <span class="text-caption">FCOT</span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';

// Replace these with your actual image imports
const CentralProcessingFacility = 'https://cdn-icons-png.flaticon.com/512/3342/3342135.png';
const DehydrationUnit = 'https://cdn-icons-png.flaticon.com/512/3342/3342137.png';
const DrainagePoint = 'https://cdn-icons-png.flaticon.com/512/1583/1583079.png';
const Flowstation = 'https://cdn-icons-png.flaticon.com/512/3342/3342132.png';
const GasDemand = 'https://cdn-icons-png.flaticon.com/512/3342/3342138.png';
const GasProcessingFacility = 'https://cdn-icons-png.flaticon.com/512/3342/3342135.png';
const Pipeline = 'https://cdn-icons-png.flaticon.com/512/1580/1580750.png';
const Terminal = 'https://cdn-icons-png.flaticon.com/512/3342/3342136.png';

export default defineComponent({
  name: 'NetworkVisualization',
  setup() {
    const surfaceNetwork = ref(null);
    const surfaceNodes = ref(null);
    const surfaceEdges = ref(null);

    const drainagePoint = ref(DrainagePoint);
    const centralProcessingFacility = ref(CentralProcessingFacility);
    const dehydrationUnit = ref(DehydrationUnit);
    const flowstation = ref(Flowstation);
    const gasDemand = ref(GasDemand);
    const gasProcessingFacility = ref(GasProcessingFacility);
    const pipeline = ref(Pipeline);
    const terminal = ref(Terminal);
    
    const zoomIn = () => {
      if (surfaceNetwork.value) {
        const scale = surfaceNetwork.value.getScale();
        surfaceNetwork.value.moveTo({ scale: scale * 1.2 });
      }
    };
    
    const zoomOut = () => {
      if (surfaceNetwork.value) {
        const scale = surfaceNetwork.value.getScale();
        surfaceNetwork.value.moveTo({ scale: scale * 0.8 });
      }
    };
    
    const fitView = () => {
      if (surfaceNetwork.value) {
        surfaceNetwork.value.fit();
      }
    };

    onMounted(() => {
      // Initialize surface network
      const surfaceContainer = document.getElementById('surfaceNetwork');
      
      // Define nodes with different styles based on type
      surfaceNodes.value = new DataSet([
        // Wells (on the left)
        { id: 'WELL_GROUP_1', label: 'Wells\n(ABU_FS1)', x: -800, y: -200, shape: 'image', image: DrainagePoint, size: 25, font: { size: 14, color: 'white', strokeWidth: 3, strokeColor: 'rgba(0,0,0,0.7)' } },
        { id: 'WELL_GROUP_2', label: 'Wells\n(ABU_FS2)', x: -800, y: 0, shape: 'image', image: DrainagePoint, size: 25, font: { size: 14, color: 'white', strokeWidth: 3, strokeColor: 'rgba(0,0,0,0.7)' } },
        { id: 'WELL_GROUP_3', label: 'Wells\n(ABU_FS3)', x: -800, y: 200, shape: 'image', image: DrainagePoint, size: 25, font: { size: 14, color: 'white', strokeWidth: 3, strokeColor: 'rgba(0,0,0,0.7)' } },
        
        // Facilities
        { id: 'ABU_FS1', label: 'ABU_FS1', x: -500, y: -200, shape: 'image', image: Flowstation, size: 30, font: { size: 16, color: 'white', strokeWidth: 3, strokeColor: 'rgba(0,0,0,0.7)' } },
        { id: 'ABU_FS2', label: 'ABU_FS2', x: -500, y: 0, shape: 'image', image: Flowstation, size: 30, font: { size: 16, color: 'white', strokeWidth: 3, strokeColor: 'rgba(0,0,0,0.7)' } },
        { id: 'ABU_FS3', label: 'ABU_FS3', x: -500, y: 200, shape: 'image', image: Flowstation, size: 30, font: { size: 16, color: 'white', strokeWidth: 3, strokeColor: 'rgba(0,0,0,0.7)' } },
        
        // CPFs
        { id: 'REO_CPF_AGG', label: 'REO_CPF_AGG', x: -100, y: 0, shape: 'image', image: GasProcessingFacility, size: 35, font: { size: 14, color: 'white', strokeWidth: 3, strokeColor: 'rgba(0,0,0,0.7)' } },
        { id: 'REO_CPF', label: 'REO_CPF', x: 100, y: 0, shape: 'image', image: CentralProcessingFacility, size: 35, font: { size: 14, color: 'white', strokeWidth: 3, strokeColor: 'rgba(0,0,0,0.7)' } },
        
        // Pipelines (using diamond shape instead of images for better visibility)
        { id: 'Oil_Pipeline_1', label: 'Oil Pipeline 1', x: 200, y: -100, color: '#f39c12', shape: 'diamond', font: { size: 14, color: 'white', strokeWidth: 3, strokeColor: 'rgba(0,0,0,0.7)' } },
        { id: 'Gas_Pipeline_2', label: 'Gas Pipeline 2', x: 300, y: 0, color: '#f39c12', shape: 'diamond', font: { size: 14, color: 'white', strokeWidth: 3, strokeColor: 'rgba(0,0,0,0.7)' } },
        
        // Other components
        { id: 'Gas_Customer_1', label: 'Gas Customer 1', x: 700, y: 0, shape: 'image', image: GasDemand, size: 35, font: { size: 16, color: 'white', strokeWidth: 3, strokeColor: 'rgba(0,0,0,0.7)' } },
        { id: 'FCOT', label: 'FCOT', x: 700, y: -200, shape: 'image', image: Terminal, size: 35, font: { size: 16, color: 'white', strokeWidth: 3, strokeColor: 'rgba(0,0,0,0.7)' } },
      ]);
      
      // Define edges with orthogonal routing
    //   surfaceEdges.value = new DataSet([
    //     // Wells to Facilities
    //     { from: 'WELL_GROUP_1', to: 'ABU_FS1', arrows: 'to', width: 2, color: { color: '#333', opacity: 0.7 }, smooth: { enabled: true, type: 'discrete', roundness: 0 } },
    //     { from: 'WELL_GROUP_2', to: 'ABU_FS2', arrows: 'to', width: 2, color: { color: '#333', opacity: 0.7 }, smooth: { enabled: true, type: 'discrete', roundness: 0 } },
    //     { from: 'WELL_GROUP_3', to: 'ABU_FS3', arrows: 'to', width: 2, color: { color: '#333', opacity: 0.7 }, smooth: { enabled: true, type: 'discrete', roundness: 0 } },
        
    //     // ABU_FS1 connections
    //     { from: 'ABU_FS1', to: 'Oil_Pipeline_1', arrows: 'to', width: 2, color: { color: '#333', opacity: 0.7 }, smooth: { enabled: true, type: 'discrete', roundness: 0 } },
    //     { from: 'Oil_Pipeline_1', to: 'FCOT', arrows: 'to', width: 2, color: { color: '#333', opacity: 0.7 }, smooth: { enabled: true, type: 'discrete', roundness: 0 } },
    //     { from: 'ABU_FS1', to: 'REO_CPF_AGG', arrows: 'to', width: 2, color: { color: '#333', opacity: 0.7 }, smooth: { enabled: true, type: 'discrete', roundness: 0 } },
    //     { from: 'REO_CPF_AGG', to: 'REO_CPF', arrows: 'to', width: 2, color: { color: '#333', opacity: 0.7 }, smooth: { enabled: true, type: 'discrete', roundness: 0 } },
    //     { from: 'REO_CPF', to: 'Gas_Pipeline_2', arrows: 'to', width: 2, color: { color: '#333', opacity: 0.7 }, smooth: { enabled: true, type: 'discrete', roundness: 0 } },
    //     { from: 'Gas_Pipeline_2', to: 'Gas_Customer_1', arrows: 'to', width: 2, color: { color: '#333', opacity: 0.7 }, smooth: { enabled: true, type: 'discrete', roundness: 0 } },
    //   ]);

      surfaceEdges.value = createEdgesWithOrthogonalPaths(surfaceNodes.value);
      
      // Provide the data in the vis format
      const surfaceData = {
        nodes: surfaceNodes.value,
        edges: surfaceEdges.value
      };
      
      const surfaceOptions = {
        layout: {
          randomSeed: 2,
          improvedLayout: true,
          hierarchical: {
            enabled: false
          }
        },
        physics: {
          enabled: false
        },
        nodes: {
          shapeProperties: {
            useBorderWithImage: true
          },
          borderWidth: 2,
          borderWidthSelected: 4,
          shadow: true,
          color: {
            border: '#000000',
            background: '#000000',
            highlight: {
              border: '#39FF14',
              background: '#39FF14'
            }
          }
        },
        edges: {
          width: 2,
          shadow: true,
          arrows: {
            to: {
              enabled: true,
              scaleFactor: 0.8
            }
          },
          color: {
            color: '#ffffff',
            opacity: 0.7
          },
          smooth: {
            enabled: true,
            type: 'discrete',
            roundness: 0
          }
        },
        interaction: {
          hover: true,
          tooltipDelay: 200,
          zoomView: true,
          dragView: true
        }
      };
      
      // Initialize the network
      surfaceNetwork.value = new Network(surfaceContainer, surfaceData, surfaceOptions);
    });

    // Function to create orthogonal edges
    function createEdgesWithOrthogonalPaths() {
    const orthogonalEdges = [];
    const nodes = surfaceNodes.value;
    
    // Define all connections
    const connections = [
        // Wells to Facilities
        { from: 'WELL_GROUP_1', to: 'ABU_FS1' },
        { from: 'WELL_GROUP_2', to: 'ABU_FS2' },
        { from: 'WELL_GROUP_3', to: 'ABU_FS3' },
        // Add all other connections...
    ];
    
    // Create edges with orthogonal paths
    connections.forEach(conn => {
        const fromNode = nodes.get(conn.from);
        const toNode = nodes.get(conn.to);
        
        if (fromNode && toNode) {
        orthogonalEdges.push({
            from: conn.from,
            to: conn.to,
            arrows: 'to',
            width: 2,
            color: { color: '#333', opacity: 0.7 },
            smooth: {
            enabled: true,
            type: 'discrete',
            roundness: 0
            },
            // Predefine the orthogonal path
            points: [
            { x: fromNode.x, y: fromNode.y },
            { x: toNode.x, y: fromNode.y }, // Horizontal segment
            { x: toNode.x, y: toNode.y }    // Vertical segment
            ]
        });
        }
    });
    
    return new DataSet(orthogonalEdges);
    }

    return {
      zoomIn,
      zoomOut,
      fitView,
      drainagePoint,
      centralProcessingFacility,
      dehydrationUnit,
      flowstation,
      gasDemand,
      gasProcessingFacility,
      pipeline,
      terminal
    };
  }
});
</script>

<style scoped>
.network-container {
  height: 600px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #fafafa;
}
.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.legend-img {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}
.custom-card {
  border-radius: 8px;
  box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.1);
}
</style>