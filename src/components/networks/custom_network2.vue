<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="custom-card">
          <q-card-section>
            <div class="text-h6">Network Overview</div>
            <div class="text-caption text-grey">
              Visualize the flow from wells (left) to customers and FCOT (right)
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row items-center q-mb-md">
              <div class="col-auto">
                <q-btn-toggle
                  v-model="activeTab"
                  toggle-color="primary"
                  :options="[
                    {label: 'Surface Network', value: 'surface'},
                    {label: 'Sub-surface Network', value: 'subsurface'}
                  ]"
                />
              </div>
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

            <div class="network-container" v-show="activeTab === 'surface'">
              <div id="surfaceNetwork" style="width: 100%; height: 100%;"></div>
            </div>

            <div class="network-container" v-show="activeTab === 'subsurface'">
              <div id="subsurfaceNetwork" style="width: 100%; height: 100%;"></div>
            </div>

            <div class="row justify-center q-mt-md">
              <div class="legend-item">
                <div class="legend-color" style="background-color: #e74c3c;"></div>
                <span class="text-caption">Well</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background-color: #3498db;"></div>
                <span class="text-caption">Facility</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background-color: #2ecc71;"></div>
                <span class="text-caption">CPF</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background-color: #f39c12;"></div>
                <span class="text-caption">Pipeline</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background-color: #9b59b6;"></div>
                <span class="text-caption">Dehydration Unit</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background-color: #1abc9c;"></div>
                <span class="text-caption">Gas Customer</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background-color: #e67e22;"></div>
                <span class="text-caption">FCOT</span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card class="custom-card">
          <q-card-section>
            <div class="text-h6">Network Statistics</div>
          </q-card-section>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-item>
                  <q-item-section>
                    <q-item-label overline>Total Wells</q-item-label>
                    <q-item-label class="text-h6 text-primary">142</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-item-section>
                    <q-item-label overline>Facilities</q-item-label>
                    <q-item-label class="text-h6 text-primary">12</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-item-section>
                    <q-item-label overline>Pipelines</q-item-label>
                    <q-item-label class="text-h6 text-primary">8</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-item-section>
                    <q-item-label overline>CPFs</q-item-label>
                    <q-item-label class="text-h6 text-primary">5</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card class="custom-card">
          <q-card-section>
            <div class="text-h6">Recent Activities</div>
          </q-card-section>
          <q-card-section>
            <q-timeline color="secondary">
              <q-timeline-entry
                title="Maintenance Completed"
                subtitle="February 22, 2023"
                icon="engineering"
              >
                <div>Regular maintenance completed on ABU_FS1 facility</div>
              </q-timeline-entry>
              <q-timeline-entry
                title="New Well Connected"
                subtitle="February 18, 2023"
                icon="precision_manufacturing"
              >
                <div>FO11HA7T well connected to REO_GP4 facility</div>
              </q-timeline-entry>
              <q-timeline-entry
                title="Inspection Passed"
                subtitle="February 15, 2023"
                icon="fact_check"
              >
                <div>Quarterly inspection passed for all pipelines</div>
              </q-timeline-entry>
            </q-timeline>
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

export default defineComponent({
  name: 'NetworkVisualization',
  setup() {
    const activeTab = ref('surface');
    const surfaceNetwork = ref(null);
    const subsurfaceNetwork = ref(null);
    
    const showNetwork = (networkType) => {
      activeTab.value = networkType;
    };
    
    const zoomIn = () => {
      const network = activeTab.value === 'surface' ? surfaceNetwork.value : subsurfaceNetwork.value;
      if (network) {
        const scale = network.getScale();
        network.moveTo({ scale: scale * 1.2 });
      }
    };
    
    const zoomOut = () => {
      const network = activeTab.value === 'surface' ? surfaceNetwork.value : subsurfaceNetwork.value;
      if (network) {
        const scale = network.getScale();
        network.moveTo({ scale: scale * 0.8 });
      }
    };
    
    const fitView = () => {
      const network = activeTab.value === 'surface' ? surfaceNetwork.value : subsurfaceNetwork.value;
      if (network) {
        network.fit();
      }
    };

    onMounted(() => {
      // Initialize surface network
      const surfaceContainer = document.getElementById('surfaceNetwork');
      
      // Define nodes with different styles based on type
      const surfaceNodes = new DataSet([
        // Wells (on the left)
        { id: 'WELL_GROUP_1', label: 'Wells\n(ABU_FS1)', x: -800, y: -200, color: '#e74c3c', shape: 'dot', size: 20, font: { size: 14, color: 'white' } },
        { id: 'WELL_GROUP_2', label: 'Wells\n(ABU_FS2)', x: -800, y: 0, color: '#e74c3c', shape: 'dot', size: 20, font: { size: 14, color: 'white' } },
        { id: 'WELL_GROUP_3', label: 'Wells\n(ABU_FS3)', x: -800, y: 200, color: '#e74c3c', shape: 'dot', size: 20, font: { size: 14, color: 'white' } },
        
        // Facilities
        { id: 'ABU_FS1', label: 'ABU_FS1', x: -500, y: -200, color: '#3498db', shape: 'box', font: { size: 16, color: 'white' } },
        { id: 'ABU_FS2', label: 'ABU_FS2', x: -500, y: 0, color: '#3498db', shape: 'box', font: { size: 16, color: 'white' } },
        { id: 'ABU_FS3', label: 'ABU_FS3', x: -500, y: 200, color: '#3498db', shape: 'box', font: { size: 16, color: 'white' } },
        
        // CPFs
        { id: 'REO_CPF_AGG', label: 'REO_CPF_AGG', x: -100, y: 0, color: '#2ecc71', shape: 'ellipse', font: { size: 14, color: 'white' } },
        { id: 'REO_CPF', label: 'REO_CPF', x: 100, y: 0, color: '#2ecc71', shape: 'ellipse', font: { size: 14, color: 'white' } },
        
        // Pipelines
        { id: 'Oil_Pipeline_1', label: 'Oil Pipeline 1', x: 200, y: -100, color: '#f39c12', shape: 'diamond', font: { size: 14, color: 'white' } },
        { id: 'Gas_Pipeline_2', label: 'Gas Pipeline 2', x: 300, y: 0, color: '#f39c12', shape: 'diamond', font: { size: 14, color: 'white' } },
        
        // Other components
        { id: 'Gas_Customer_1', label: 'Gas Customer 1', x: 700, y: 0, color: '#1abc9c', shape: 'database', font: { size: 16, color: 'white' } },
        { id: 'FCOT', label: 'FCOT', x: 700, y: -200, color: '#e67e22', shape: 'hexagon', font: { size: 16, color: 'white' } },
      ]);
      
      // Define edges
      const surfaceEdges = new DataSet([
        // Wells to Facilities
        { from: 'WELL_GROUP_1', to: 'ABU_FS1', arrows: 'to', width: 2, color: { color: '#333', opacity: 0.7 } },
        { from: 'WELL_GROUP_2', to: 'ABU_FS2', arrows: 'to', width: 2, color: { color: '#333', opacity: 0.7 } },
        { from: 'WELL_GROUP_3', to: 'ABU_FS3', arrows: 'to', width: 2, color: { color: '#333', opacity: 0.7 } },
        
        // ABU_FS1 connections
        { from: 'ABU_FS1', to: 'Oil_Pipeline_1', arrows: 'to', width: 2, color: { color: '#333', opacity: 0.7 } },
        { from: 'Oil_Pipeline_1', to: 'FCOT', arrows: 'to', width: 2, color: { color: '#333', opacity: 0.7 } },
        { from: 'ABU_FS1', to: 'REO_CPF_AGG', arrows: 'to', width: 2, color: { color: '#333', opacity: 0.7 } },
        { from: 'REO_CPF_AGG', to: 'REO_CPF', arrows: 'to', width: 2, color: { color: '#333', opacity: 0.7 } },
        { from: 'REO_CPF', to: 'Gas_Pipeline_2', arrows: 'to', width: 2, color: { color: '#333', opacity: 0.7 } },
        { from: 'Gas_Pipeline_2', to: 'Gas_Customer_1', arrows: 'to', width: 2, color: { color: '#333', opacity: 0.7 } },
      ]);
      
      // Provide the data in the vis format
      const surfaceData = {
        nodes: surfaceNodes,
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
            color: '#333',
            opacity: 0.7
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
      
      // Initialize subsurface network
      const subsurfaceContainer = document.getElementById('subsurfaceNetwork');
      
      // Create a sample of wells and facilities for visualization
      const subsurfaceNodes = new DataSet([
        // Facilities
        { id: 'ABU_FS1', label: 'ABU_FS1', x: 400, y: 0, color: '#3498db', shape: 'box', font: { size: 16, color: 'white' } },
        { id: 'ABU_FS2', label: 'ABU_FS2', x: 400, y: 100, color: '#3498db', shape: 'box', font: { size: 16, color: 'white' } },
        { id: 'ABU_FS3', label: 'ABU_FS3', x: 400, y: 200, color: '#3498db', shape: 'box', font: { size: 16, color: 'white' } },
        
        // Sample wells
        { id: 'FO10D40T_FO10', label: 'FO10D40T', x: -600, y: 0, color: '#e74c3c', shape: 'dot', font: { size: 12, color: 'white' } },
        { id: 'FO10W01T_FO10', label: 'FO10W01T', x: -600, y: 100, color: '#e74c3c', shape: 'dot', font: { size: 12, color: 'white' } },
        { id: 'FO11_HAT_FO11', label: 'FO11_HAT', x: -600, y: 200, color: '#e74c3c', shape: 'dot', font: { size: 12, color: 'white' } },
      ]);
      
      // Define edges (sample connections)
      const subsurfaceEdges = new DataSet([
        { from: 'FO10D40T_FO10', to: 'ABU_FS1', arrows: 'to', width: 2, color: { color: '#333', opacity: 0.7 } },
        { from: 'FO10W01T_FO10', to: 'ABU_FS2', arrows: 'to', width: 2, color: { color: '#333', opacity: 0.7 } },
        { from: 'FO11_HAT_FO11', to: 'ABU_FS3', arrows: 'to', width: 2, color: { color: '#333', opacity: 0.7 } },
      ]);
      
      // Provide the data in the vis format
      const subsurfaceData = {
        nodes: subsurfaceNodes,
        edges: subsurfaceEdges
      };
      
      const subsurfaceOptions = {
        layout: {
          improvedLayout: true,
          hierarchical: {
            enabled: true,
            direction: 'LR',
            sortMethod: 'directed'
          }
        },
        physics: {
          enabled: false
        },
        nodes: {
          shape: 'dot',
          size: 20,
          font: {
            size: 12,
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
            color: '#333',
            opacity: 0.7
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
      subsurfaceNetwork.value = new Network(subsurfaceContainer, subsurfaceData, subsurfaceOptions);
    });

    return {
      activeTab,
      showNetwork,
      zoomIn,
      zoomOut,
      fitView
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
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 8px;
}
.custom-card {
  border-radius: 8px;
  box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.1);
}
</style>