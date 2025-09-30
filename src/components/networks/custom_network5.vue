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
                <img :src="drainagePoint" alt="Well" class="legend-color" />
                <span class="text-caption">Well</span>
              </div>
              <div class="legend-item">
                <img :src="flowstation" alt="Well" class="legend-color" />
                <span class="text-caption">Facility</span>
              </div>
              <div class="legend-item">
                <img :src="centralProcessingFacility" alt="Well" class="legend-color" />
                <span class="text-caption">Central Processing Facility</span>
              </div>
              <div class="legend-item">
                <img :src="gasProcessingFacility" alt="Well" class="legend-color" />
                <span class="text-caption">Gas Processing Facility</span>
              </div>
              <div class="legend-item">
                <img :src="pipeline" alt="Well" class="legend-color" />
                <span class="text-caption">Pipeline</span>
              </div>
              <div class="legend-item">
                <img :src="dehydrationUnit" alt="Well" class="legend-color" />
                <span class="text-caption">Dehydration Unit</span>
              </div>
              <div class="legend-item">
                <img :src="gasDemand" alt="Well" class="legend-color" />
                <span class="text-caption">Gas Customer</span>
              </div>
              <div class="legend-item">
                <img :src="terminal" alt="Well" class="legend-color" />
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

import CentralProcessingFacility from 'src/assets/images/CentralProcessingFacility.svg';
import DehydrationUnit from 'src/assets/images/DehydrationUnit.svg';
import DrainagePoint from 'src/assets/images/DrainagePoint.svg';
import FPSO from 'src/assets/images/FPSO.svg';
import FSO from 'src/assets/images/FSO.svg';
import Flowstation from 'src/assets/images/Flowstation.svg';
import GasDemand from 'src/assets/images/GasDemand.svg';
import GasProcessingFacility from 'src/assets/images/GasProcessingFacility.svg';
import Manifold from 'src/assets/images/Manifold.svg';
import Pipeline from 'src/assets/images/Pipeline.svg';
import ProductionPlatform from 'src/assets/images/ProductionPlatform.svg';
import SubseaManifold from 'src/assets/images/SubseaManifold.svg';
import SubseaTemplate from 'src/assets/images/SubseaTemplate.svg';
import Terminal from 'src/assets/images/Terminal.svg';
import Trunkline from 'src/assets/images/Trunkline.svg';
import Umbilical from 'src/assets/images/Umbilical.svg';

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
      const surfaceNodes = new DataSet([
        // Wells (on the left)
        { id: 'WELL_GROUP_1', label: 'Wells\n(ABU_FS1)', x: 0, y: -200, color: '#e74c3c', shape: 'image', image: DrainagePoint, size: 20, font: { size: 14, color: 'black' } },
        { id: 'WELL_GROUP_2', label: 'Wells\n(ABU_FS2)', x: 0, y: 0, color: '#e74c3c', shape: 'image', image: DrainagePoint, size: 20, font: { size: 14, color: 'black' } },
        { id: 'WELL_GROUP_3', label: 'Wells\n(ABU_FS3)', x: 0, y: 200, color: '#e74c3c', shape: 'image', image: DrainagePoint, size: 20, font: { size: 14, color: 'black' } },
        
        // Facilities - Flow Stations
        { id: 'ABU_FS1', label: 'ABU_FS1', x: 500, y: -200, color: '#3498db', shape: 'image', image: Flowstation, font: { size: 16, color: 'black' } },
        { id: 'ABU_FS2', label: 'ABU_FS2', x: 500, y: 0, color: '#3498db', shape: 'image', image: Flowstation, font: { size: 16, color: 'black' } },
        { id: 'ABU_FS3', label: 'ABU_FS3', x: 500, y: 200, color: '#3498db', shape: 'image', image: Flowstation, font: { size: 16, color: 'black' } },
        { id: 'ABU_FS4', label: 'ABU_FS4', x: 500, y: 400, color: '#3498db', shape: 'image', image: Flowstation, font: { size: 16, color: 'black' } },
        { id: 'ABU_FS5', label: 'ABU_FS5', x: 500, y: -400, color: '#3498db', shape: 'image', image: Flowstation, font: { size: 16, color: 'black' } },
        { id: 'ABU_FS6', label: 'ABU_FS6', x: 500, y: 300, color: '#3498db', shape: 'image', image: Flowstation, font: { size: 16, color: 'black' } },
        { id: 'ABU_FS7', label: 'ABU_FS7', x: 500, y: -300, color: '#3498db', shape: 'image', image: Flowstation, font: { size: 16, color: 'black' } },
         // Facilities - Gas Plants
        { id: 'REO_GP1', label: 'REO_GP1', x: 500, y: -150, color: '#3498db', shape: 'image', image: Flowstation, font: { size: 14, color: 'black' } },
        { id: 'REO_GP2', label: 'REO_GP2', x: 500, y: -350, color: '#3498db', shape: 'image', image: Flowstation, font: { size: 14, color: 'black' } },
        { id: 'REO_GP3', label: 'REO_GP3', x: 500, y: 150, color: '#3498db', shape: 'image', image: Flowstation, font: { size: 14, color: 'black' } },
        { id: 'REO_GP4', label: 'REO_GP4', x: 500, y: 250, color: '#3498db', shape: 'image', image: Flowstation, font: { size: 14, color: 'black' } },
        { id: 'REO_GP5', label: 'REO_GP5', x: 500, y: -250, color: '#3498db', shape: 'image', image: Flowstation, font: { size: 14, color: 'black' } },
        
        // CPFs
        { id: 'REO_CPF_AGG', label: 'REO_CPF_AGG', x: -100, y: 0, color: '#2ecc71', shape: 'image', image: GasProcessingFacility, font: { size: 14, color: 'black' } },
        { id: 'REO_CPF', label: 'REO_CPF', x: 100, y: 0, color: '#2ecc71', shape: 'image', image: CentralProcessingFacility, font: { size: 14, color: 'black' } },
        { id: 'REO_CPF_NAG', label: 'REO_CPF_NAG', x: -100, y: -100, color: '#2ecc71', shape: 'image', image: GasProcessingFacility, font: { size: 14, color: 'black' } },
        { id: 'REO_ABU_CPF_1', label: 'REO_ABU_CPF_1', x: 200, y: 200, color: '#2ecc71', shape: 'image', image: CentralProcessingFacility, font: { size: 14, color: 'black' } },
        { id: 'REO_ABU_CPF_1_&_2', label: 'REO_ABU_CPF\n1 & 2', x: 400, y: 200, color: '#2ecc71', shape: 'image', image: CentralProcessingFacility, font: { size: 14, color: 'black' } },
        
        // Pipelines
        { id: 'Oil_Pipeline_1', label: 'Oil Pipeline 1', x: 200, y: -100, color: '#f39c12', shape: 'diamond', image: Pipeline, font: { size: 5, color: 'black' } },
        { id: 'Oil_Pipeline_2', label: 'Oil Pipeline 2', x: 200, y: -300, color: '#f39c12', shape: 'diamond', image: Pipeline, font: { size: 5, color: 'black' } },
        { id: 'Oil_Pipeline_3', label: 'Oil Pipeline 3', x: 300, y: 100, color: '#f39c12', shape: 'diamond', image: Pipeline, font: { size: 5, color: 'black' } },
        { id: 'Oil_Pipeline_4', label: 'Oil Pipeline 4', x: 300, y: -200, color: '#f39c12', shape: 'diamond', image: Pipeline, font: { size: 5, color: 'black' } },
        { id: 'Oil_Pipeline_5', label: 'Oil Pipeline 5', x: 500, y: 100, color: '#f39c12', shape: 'diamond', image: Pipeline, font: { size: 5, color: 'black' } },
        { id: 'Gas_Pipeline_1', label: 'Gas Pipeline 1', x: 100, y: 100, color: '#f39c12', shape: 'diamond', image: Pipeline, font: { size: 5, color: 'black' } },
        { id: 'Gas_Pipeline_2', label: 'Gas Pipeline 2', x: 300, y: 0, color: '#f39c12', shape: 'diamond', image: Pipeline, font: { size: 5, color: 'black' } },
        { id: 'Gas_Pipeline_2a', label: 'Gas Pipeline 2a', x: 300, y: -400, color: '#f39c12', shape: 'diamond', image: Pipeline, font: { size: 5, color: 'black' } },
        { id: 'Gas_Pipeline_3', label: 'Gas Pipeline 3', x: 300, y: 300, color: '##f39c12', shape: 'diamond', image: Pipeline, font: { size: 5, color: 'black' } },
        { id: 'Gas_Pipeline_4', label: 'Gas Pipeline 4', x: 300, y: -100, color: '#f39c12', shape: 'diamond', image: Pipeline, font: { size: 5, color: 'black' } },
        { id: 'Gas_Pipeline_5', label: 'Gas Pipeline 5', x: 500, y: 300, color: '#f39c12', shape: 'diamond', image: Pipeline, font: { size: 5, color: 'black' } },
        
        // Other components
        { id: 'Dehydration_Unit', label: 'Dehydration\nUnit', x: 200, y: -400, color: '#9b59b6', shape: 'image', image: DehydrationUnit, font: { size: 14, color: 'black' } },
        { id: 'Gas_Customer_1', label: 'Gas Customer 1', x: 700, y: 0, color: '#1abc9c', shape: 'image', image: GasDemand, font: { size: 16, color: 'black' } },
        { id: 'Gas_Customer_2', label: 'Gas Customer 2', x: 700, y: 200, color: '#1abc9c', shape: 'image', image: GasDemand, font: { size: 16, color: 'black' } },
        { id: 'FCOT', label: 'FCOT', x: 700, y: -200, color: '#e67e22', shape: 'image', image: Terminal, font: { size: 16, color: 'black' } },
        
      ]);

      const connections = [
        // Wells to Facilities
        { from: 'WELL_GROUP_1', to: 'ABU_FS1'},
        { from: 'WELL_GROUP_2', to: 'ABU_FS2'},
        { from: 'WELL_GROUP_3', to: 'ABU_FS3'},
        
        // ABU_FS1 connections
        { from: 'ABU_FS1', to: 'Oil_Pipeline_1'},
        { from: 'Oil_Pipeline_1', to: 'FCOT'},
        { from: 'ABU_FS1', to: 'REO_CPF_AGG'},
        { from: 'REO_CPF_AGG', to: 'REO_CPF'},
        { from: 'REO_CPF', to: 'Gas_Pipeline_2'},
        { from: 'Gas_Pipeline_2', to: 'Gas_Customer_1'},
        
        // ABU_FS3 connections
        { from: 'ABU_FS3', to: 'Oil_Pipeline_1'},
        { from: 'ABU_FS3', to: 'REO_CPF_AGG'},
        
        // ABU_FS4 connections
        { from: 'ABU_FS4', to: 'Oil_Pipeline_1'},
        { from: 'ABU_FS4', to: 'REO_CPF_AGG'},
        
        // ABU_FS5 connections
        { from: 'ABU_FS5', to: 'Oil_Pipeline_1'},
        { from: 'ABU_FS5', to: 'REO_CPF_AGG'},
        
        // ABU_FS2 connections
        { from: 'ABU_FS2', to: 'REO_CPF'},
        { from: 'REO_CPF', to: 'Oil_Pipeline_1'},
        { from: 'ABU_FS2', to: 'REO_CPF_AGG'},
        
        // REO_GP1 connections
        { from: 'REO_GP1', to: 'REO_CPF'},
        { from: 'REO_GP1', to: 'REO_CPF_NAG'},
        { from: 'REO_CPF_NAG', to: 'REO_CPF'},
        
        // REO_GP3 connections
        { from: 'REO_GP3', to: 'Oil_Pipeline_1'},
        { from: 'REO_GP3', to: 'Gas_Pipeline_1'},
        { from: 'Gas_Pipeline_1', to: 'Gas_Pipeline_2'},
        
        // REO_GP2 connections
        { from: 'REO_GP2', to: 'Oil_Pipeline_2'},
        { from: 'Oil_Pipeline_2', to: 'FCOT'},
        { from: 'REO_GP2', to: 'Dehydration_Unit'},
        { from: 'Dehydration_Unit', to: 'Gas_Pipeline_2a'},
        { from: 'Gas_Pipeline_2a', to: 'Gas_Customer_2'},
        
        // ABU_FS6 connections
        { from: 'ABU_FS6', to: 'REO_ABU_CPF_1'},
        { from: 'REO_ABU_CPF_1', to: 'Oil_Pipeline_3'},
        { from: 'Oil_Pipeline_3', to: 'REO_ABU_CPF_1_&_2'},
        { from: 'REO_ABU_CPF_1_&_2', to: 'Oil_Pipeline_5'},
        { from: 'Oil_Pipeline_5', to: 'FCOT'},
        { from: 'ABU_FS6', to: 'REO_ABU_CPF_1'},
        { from: 'REO_ABU_CPF_1', to: 'Gas_Pipeline_3'},
        { from: 'Gas_Pipeline_3', to: 'REO_ABU_CPF_1_&_2'},
        { from: 'REO_ABU_CPF_1_&_2', to: 'Gas_Pipeline_5'},
        { from: 'Gas_Pipeline_5', to: 'Gas_Customer_2'},
        
        // REO_GP4 connections
        { from: 'REO_GP4', to: 'REO_ABU_CPF_1'},
        
        // ABU_FS7 connections
        { from: 'ABU_FS7', to: 'Oil_Pipeline_4'},
        { from: 'Oil_Pipeline_4', to: 'REO_ABU_CPF_1_&_2'},
        { from: 'ABU_FS7', to: 'Gas_Pipeline_4'},
        
        // REO_GP5 connections
        { from: 'REO_GP5', to: 'Oil_Pipeline_4'},
        { from: 'REO_GP5', to: 'Gas_Pipeline_4'},
      ];
      
      // Define edges
      const surfaceEdges = createEdgesWithOrthogonalPaths(surfaceNodes, connections);
      
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
      
    });

    // Function to create orthogonal edges
    function createEdgesWithOrthogonalPaths(nodes, connections) {
        const orthogonalEdges = [];
        //const nodes = surfaceNodes.value;
        
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