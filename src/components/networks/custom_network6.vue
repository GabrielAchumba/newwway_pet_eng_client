<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Main network visualization area -->
      <div class="col-10">
        <q-card class="custom-card">
          <!-- <q-card-section>
            <div class="text-h6">Network Overview</div>
            <div class="text-caption text-grey">
              Visualize the flow from wells (left) to customers and FCOT (right)
            </div>
          </q-card-section> -->
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
                <img :src="drainagePoint" alt="DrainagePoint" class="legend-color" />
                <span class="text-caption">Drainage Point</span>
              </div>
              <div class="legend-item">
                <img :src="reservoir" alt="Reservoir" class="legend-color" />
                <span class="text-caption">Reservoir</span>
              </div>
              <div class="legend-item">
                <img :src="well" alt="Well" class="legend-color" />
                <span class="text-caption">Well</span>
              </div>
              <div class="legend-item">
                <img :src="field" alt="Field" class="legend-color" />
                <span class="text-caption">Field</span>
              </div>
              <div class="legend-item">
                <img :src="flowstation" alt="Facility" class="legend-color" />
                <span class="text-caption">Facility</span>
              </div>
              <div class="legend-item">
                <img :src="centralProcessingFacility" alt="centralProcessingFacility" class="legend-color" />
                <span class="text-caption">Central Processing Facility</span>
              </div>
              <div class="legend-item">
                <img :src="gasProcessingFacility" alt="gasProcessingFacility" class="legend-color" />
                <span class="text-caption">Gas Processing Facility</span>
              </div>
              <div class="legend-item">
                <img :src="pipeline" alt="pipeline" class="legend-color" />
                <span class="text-caption">Pipeline</span>
              </div>
              <div class="legend-item">
                <img :src="dehydrationUnit" alt="dehydrationUnit" class="legend-color" />
                <span class="text-caption">Dehydration Unit</span>
              </div>
              <div class="legend-item">
                <img :src="gasDemand" alt="gasDemand" class="legend-color" />
                <span class="text-caption">Gas Customer</span>
              </div>
              <div class="legend-item">
                <img :src="terminal" alt="terminal" class="legend-color" />
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
import { defineComponent, ref, onMounted, watch } from 'vue';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { storeToRefs } from 'pinia';
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';


const assetsExplorerStore = useAssetsExplorerStore();

const CentralProcessingFacility = 'https://cdn-icons-png.flaticon.com/512/3342/3342135.png';
const DehydrationUnit = 'https://cdn-icons-png.flaticon.com/512/3342/3342137.png';
const DrainagePoint = 'https://cdn-icons-png.flaticon.com/512/1583/1583079.png';
const Flowstation = 'https://cdn-icons-png.flaticon.com/512/3342/3342132.png';
const GasDemand = 'https://cdn-icons-png.flaticon.com/512/3342/3342138.png';
const GasProcessingFacility = 'https://cdn-icons-png.flaticon.com/512/3342/3342135.png';
const Pipeline = 'https://cdn-icons-png.flaticon.com/512/1580/1580750.png';
const Terminal = 'https://cdn-icons-png.flaticon.com/512/3342/3342136.png';
const Reservoir = 'https://cdn-icons-png.flaticon.com/512/2697/2697226.png';
const Field = 'https://cdn-icons-png.flaticon.com/512/8084/8084333.png';
const Well = 'https://cdn-icons-png.flaticon.com/512/2697/2697226.png';


export default defineComponent({
  name: 'NetworkVisualization',
  setup() {
    const surfaceNetwork = ref(null);

    const drainagePoint = ref(DrainagePoint);
    const centralProcessingFacility = ref(CentralProcessingFacility);
    const dehydrationUnit = ref(DehydrationUnit);
    const flowstation = ref(Flowstation);
    const gasDemand = ref(GasDemand);
    const gasProcessingFacility = ref(GasProcessingFacility);
    const pipeline = ref(Pipeline);
    const terminal = ref(Terminal);
    const reservoir = ref(Reservoir);
    const field = ref(Field);
    const well = ref(Well);
    
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

    const { networkNodes, networkConnections } = storeToRefs(assetsExplorerStore);

    // If you have a drawNetwork function
    const drawNetwork = (nodes, connections) => {
     
      // Initialize surface network

      const surfaceContainer = document.getElementById('surfaceNetwork');
      
      // Define nodes with different styles based on type
      //const surfaceNodes = new DataSet(nodes);

      //console.log("nodes***: ", nodes)

      
      // Define edges
      const surfaceEdges = createEdgesWithOrthogonalPaths(nodes, connections);
      
    // Provide the data in the vis format
      const surfaceData = {
        nodes: new DataSet(nodes),
        edges: surfaceEdges
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
          shape: 'dot',
          size: 30,
          font: {
            size: 14,
            face: 'Roboto'
          },
          borderWidth: 2,
          shadow: true
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
            color: '#ffffff',//'#333',
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
    }

    // Redraw when data changes
    watch([networkNodes, networkConnections], ([nodes, connections]) => {
      if (nodes.length && connections.length) {
        drawNetwork(nodes, connections)
      }
    }, { immediate: true })
        

    onMounted(() => {
      
      //console.log("networkNodes.value: ", networkNodes.value)
       // console.log("networkConnections.value: ", networkConnections.value)

      if (networkNodes.value.length && networkConnections.value.length) {
        
        drawNetwork(networkNodes.value, networkConnections.value)
      }
    });

    // Function to create orthogonal edges
    function createEdgesWithOrthogonalPaths(nodes, connections) {
        const orthogonalEdges = [];
        //const nodes = _surfaceNodes.value;
        
        // Create edges with orthogonal paths
        connections.forEach(conn => {
            //const fromNode = nodes.get(conn.from);
            //const toNode = nodes.get(conn.to);

            const fromNode = nodes.find(n => n.id === conn.from)
            const toNode   = nodes.find(n => n.id === conn.to)
            
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
      terminal,
      reservoir,
      field,
      well
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
  margin-right: 16px;
}
.legend-color {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 8px;
}
.custom-card {
  border-radius: 8px;
  box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.1);
}
</style>