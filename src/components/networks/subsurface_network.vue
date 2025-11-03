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
            </div>
          </q-card-section>
          <!-- Data Status Legend -->
          <q-card-section>
            <div class="text-h6">Data Status</div>
            <div class="column q-gutter-md q-mt-md">
              <div class="legend-item">
                <div class="legend-status-circle status-no-data"></div>
                <span class="text-caption">No Data</span>
              </div>
              <div class="legend-item">
                <div class="legend-status-circle status-partial-data"></div>
                <span class="text-caption">No Flow</span>
              </div>
              <div class="legend-item">
                <div class="legend-status-circle status-complete-data"></div>
                <span class="text-caption">Complete Data</span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Component Form Dialog -->
    <q-dialog v-model="showComponentForm">
        <network-active-dialog
        v-if="selectedComponent"
        :selectedComponent="selectedComponent"
        @saved="handleFormSaved"
        @cancel="showComponentForm = false"
        />
    </q-dialog>

  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { storeToRefs } from 'pinia';
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';
import NetworkActiveDialog from 'src/components/dialogs/network_active_dialog.vue';


const assetsExplorerStore = useAssetsExplorerStore();

const DrainagePoint = 'https://cdn-icons-png.flaticon.com/512/1583/1583079.png';
const Flowstation = 'https://cdn-icons-png.flaticon.com/512/3342/3342132.png';
const Reservoir = 'https://cdn-icons-png.flaticon.com/512/2697/2697226.png';
const Field = 'https://cdn-icons-png.flaticon.com/512/8084/8084333.png';
const Well = 'https://cdn-icons-png.flaticon.com/512/2697/2697226.png';


export default defineComponent({
  name: 'NetworkVisualization',
  components: {
    NetworkActiveDialog
  },
  setup() {
    const surfaceNetwork = ref(null);
    const showComponentForm = ref(false);
    const selectedComponent = ref(null);

    const drainagePoint = ref(DrainagePoint);
    const flowstation = ref(Flowstation);
    const reservoir = ref(Reservoir);
    const field = ref(Field);
    const well = ref(Well);

    const allToolbarItems = ref({
        "Drainage Point": [
            {id: 1, title: "Input", title2: "DP-Input", visible: true, style: "border-right: 2px solid #0A1D3F;" },
            {id: 2, title: "Results", title2: "DP-Results", visible: false, style: "border-right: 2px solid #0A1D3F;"},
            {id: 3, title: "Plot", title2: "DP-Plot", visible: false, style: "border-right: 2px solid #0A1D3F;"},
            {id: 4, title: "Save", title2: "DP-Save", visible: false},
        ],
        "Well": [
            {id: 1, title: "Input", title2: "DP-Input", visible: false, style: "border-right: 2px solid #0A1D3F;" },
            {id: 2, title: "Results", title2: "DP-Results", visible: false, style: "border-right: 2px solid #0A1D3F;"},
            {id: 3, title: "Plot", title2: "DP-Plot", visible: false, style: "border-right: 2px solid #0A1D3F;"},
            {id: 4, title: "Save", title2: "DP-Save", visible: false},
        ],
        "Reservoir": [
            {id: 1, title: "Input", title2: "DP-Input", visible: false, style: "border-right: 2px solid #0A1D3F;" },
            {id: 2, title: "Results", title2: "DP-Results", visible: false, style: "border-right: 2px solid #0A1D3F;"},
            {id: 3, title: "Plot", title2: "DP-Plot", visible: false, style: "border-right: 2px solid #0A1D3F;"},
            {id: 4, title: "Save", title2: "DP-Save", visible: false},
        ],
        "Field": [
            {id: 1, title: "Input", title2: "DP-Input", visible: false, style: "border-right: 2px solid #0A1D3F;" },
            {id: 2, title: "Results", title2: "DP-Results", visible: false, style: "border-right: 2px solid #0A1D3F;"},
            {id: 3, title: "Plot", title2: "DP-Plot", visible: false, style: "border-right: 2px solid #0A1D3F;"},
            {id: 4, title: "Save", title2: "DP-Save", visible: false},
        ]
    });

    const allInputLists = ref({
        "Drainage Point": [
            {id: 1, title: "Configure", title2: "DP-Configure"},
            {id: 1, title: "DCA", title2: "DP-DCA"},
            {id: 1, title: "IPR", title2: "DP-IPR"},
            {id: 2, title: "VLP", title2: "DP-VLP"},
            {id: 3, title: "Constraints", title2: "DP-Constraints"},
            {id: 4, title: "Schedule", title2: "DP-Schedule"},
        ],
        "Well": [
            {id: 1, title: "IPR", action: "clickIPRInput"},
            {id: 2, title: "VLP", action: "clickVLPInput"},
            {id: 3, title: "Constraints", action: "clickDPConstraints"},
            {id: 4, title: "Schedule", action: "clickDPSchedule"},
        ],
        "Reservoir": [
            {id: 1, title: "IPR", action: "clickIPRInput"},
            {id: 2, title: "VLP", action: "clickVLPInput"},
            {id: 3, title: "Constraints", action: "clickDPConstraints"},
            {id: 4, title: "Schedule", action: "clickDPSchedule"},
        ],
        "Field": [
            {id: 1, title: "IPR", action: "clickIPRInput"},
            {id: 2, title: "VLP", action: "clickVLPInput"},
            {id: 3, title: "Constraints", action: "clickDPConstraints"},
            {id: 4, title: "Schedule", action: "clickDPSchedule"},
        ]
    });
    
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

    // Function to determine border color based on data completeness
    const getBorderColor = (node) => {
      if (!node.dataStatus) return '#ff0000'; // Red for no data
      
      switch (node.dataStatus) {
        case 'no-data':
          return '#ff0000'; // Red
        case 'partial':
          return '#ffeb3b'; // Yellow
        case 'complete':
          return '#4caf50'; // Green
        default:
          return '#ff0000'; // Red as default
      }
    };

    // Function to process nodes and add border styling
    const processNodesWithBorderStyling = (nodes) => {
      return nodes.map(node => ({
        ...node,
        shape: 'circularImage', // Use circularImage for image nodes with borders
        size: 35, // Slightly larger to accommodate border
        borderWidth: 4, // Thicker border for visibility
        borderColor: getBorderColor(node),
        color: {
          border: getBorderColor(node),
          background: '#ffffff', //node.color?.background || '#ffffff',
          highlight: {
            border: getBorderColor(node),
            background: '#ffffff', //node.color?.background || '#ffffff'
          }
        },
        shadow: true,
        font: {
          size: 14,
          face: 'Roboto',
          color: '#333333'
        },
        // Ensure image properties are preserved
        image: node.image,
        brokenImage: node.brokenImage
      }));
    };


    const { networkNodes, networkConnections } = storeToRefs(assetsExplorerStore);

    // If you have a drawNetwork function
    const drawNetwork = (nodes, connections) => {

     
      // Initialize surface network

      const surfaceContainer = document.getElementById('surfaceNetwork');
      
      // Process nodes with border styling
      const processedNodes = processNodesWithBorderStyling(nodes);

      
      // Define edges
      const surfaceEdges = createEdgesWithOrthogonalPaths(processedNodes, connections);
      
    // Provide the data in the vis format
      const surfaceData = {
        nodes: new DataSet(processedNodes),
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
          dragView: true,
          selectable: true
        }
      };
      
      // Initialize the network
      surfaceNetwork.value = new Network(surfaceContainer, surfaceData, surfaceOptions);
      
      // Add click event listener
      surfaceNetwork.value.on('click', handleNodeClick);
    };

    // Handle node click event
    const handleNodeClick = (params) => {
        
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const nodes = surfaceNetwork.value.body.data.nodes;
        let node = nodes.get(nodeId);
        node.toolbarItems = allToolbarItems.value[node.nodeType];  

        node.inputList = allInputLists.value[node.nodeType];
        
        if (node) {
            selectedComponent.value = node;
            showComponentForm.value = true;
            console.log("selectedComponent: ", selectedComponent)
        }
      }
    };

    // Handle form saved event
    const handleFormSaved = (updatedComponent) => {
      // Update the node in the network
      if (surfaceNetwork.value && updatedComponent) {
        const nodes = surfaceNetwork.value.body.data.nodes;
        
        // Update the node with new data status
        nodes.update({
          id: updatedComponent.id,
          dataStatus: updatedComponent.dataStatus,
          borderColor: getBorderColor(updatedComponent),
          color: {
            border: getBorderColor(updatedComponent),
            background: updatedComponent.color?.background || '#ffffff',
            highlight: {
              border: getBorderColor(updatedComponent),
              background: updatedComponent.color?.background || '#ffffff'
            }
          }
        });

      }
      
      showComponentForm.value = false;
      selectedComponent.value = null;
    };

    // Redraw when data changes
    watch([networkNodes, networkConnections], ([nodes, connections]) => {
       
      if (nodes.length && connections.length) {
        drawNetwork(nodes, connections)
      }
    }, { immediate: true })
        

    onMounted(() => {
      
      console.log("networkNodes.value: ", networkNodes.value)
        console.log("networkConnections.value: ", networkConnections.value)

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
      flowstation,
      reservoir,
      field,
      well,
      showComponentForm,
      selectedComponent,
      handleFormSaved,
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

.legend-status-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 8px;
  border: 2px solid;
}
.status-no-data {
  border-color: #ff0000;
  background-color: rgba(255, 0, 0, 0.1);
}
.status-partial-data {
  border-color: #ffeb3b;
  background-color: rgba(255, 235, 59, 0.1);
}
.status-complete-data {
  border-color: #4caf50;
  background-color: rgba(76, 175, 80, 0.1);
}

.custom-card {
  border-radius: 8px;
  box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.1);
}
</style>