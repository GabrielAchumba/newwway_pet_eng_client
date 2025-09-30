<template>
  <div class="container">
    <header>
      <h1>Oil and Gas Network Visualization</h1>
      <p class="description">Interactive visualization of surface and sub-surface networks for oil and gas operations. Switch between tabs to view different network layers.</p>
    </header>
    
    <div class="tabs">
      <button 
        class="tab" 
        :class="{ active: activeTab === 'surface' }" 
        @click="showNetwork('surface')"
      >
        Surface Network
      </button>
      <button 
        class="tab" 
        :class="{ active: activeTab === 'subsurface' }" 
        @click="showNetwork('subsurface')"
      >
        Sub-Surface Network
      </button>
    </div>
    
    <div 
      id="surface-network" 
      class="network-container" 
      v-show="activeTab === 'surface'"
    >
      <h2 class="network-title">Surface Network</h2>
      <div id="surfaceNetwork" ref="surfaceNetwork" style="width: 100%; height: 90%;"></div>
    </div>
    
    <div 
      id="subsurface-network" 
      class="network-container" 
      v-show="activeTab === 'subsurface'"
    >
      <h2 class="network-title">Sub-Surface Network</h2>
      <div id="subsurfaceNetwork" ref="subsurfaceNetwork" style="width: 100%; height: 90%;"></div>
    </div>
    
    <div class="legend">
      <div class="legend-item">
        <div class="legend-color" style="background-color: #e74c3c;"></div>
        <span class="legend-text">Well</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #3498db;"></div>
        <span class="legend-text">Facility</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #2ecc71;"></div>
        <span class="legend-text">CPF</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #f39c12;"></div>
        <span class="legend-text">Pipeline</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #9b59b6;"></div>
        <span class="legend-text">Dehydration Unit</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #1abc9c;"></div>
        <span class="legend-text">Gas Customer</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #e67e22;"></div>
        <span class="legend-text">FCOT</span>
      </div>
    </div>
    
    <div class="footer">
      <p>Oil and Gas Network Visualization | Compatible with Vue.js, React.js, and other JavaScript frameworks</p>
    </div>
  </div>
</template>

<script>
import { DataSet, Network } from 'vis-network';
import 'vis-network/styles/vis-network.css';

export default {
  name: 'NetworkVisualization',
  data() {
    return {
      activeTab: 'surface',
      surfaceNetwork: null,
      subsurfaceNetwork: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initSurfaceNetwork();
      this.initSubsurfaceNetwork();
    });
  },
  beforeUnmount() {
    // Clean up network instances if needed
    if (this.surfaceNetwork) {
      this.surfaceNetwork.destroy();
    }
    if (this.subsurfaceNetwork) {
      this.subsurfaceNetwork.destroy();
    }
  },
  methods: {
    showNetwork(networkType) {
      this.activeTab = networkType;
    },
    initSurfaceNetwork() {
      const container = this.$refs.surfaceNetwork;
      
      // Define nodes with different styles based on type
      const nodes = new DataSet([
        // Facilities
        { id: 'ABU_FS1', label: 'ABU_FS1', color: '#3498db', shape: 'box', font: { size: 14, color: 'white' } },
        { id: 'ABU_FS2', label: 'ABU_FS2', color: '#3498db', shape: 'box', font: { size: 14, color: 'white' } },
        { id: 'ABU_FS3', label: 'ABU_FS3', color: '#3498db', shape: 'box', font: { size: 14, color: 'white' } },
        { id: 'ABU_FS4', label: 'ABU_FS4', color: '#3498db', shape: 'box', font: { size: 14, color: 'white' } },
        { id: 'ABU_FS5', label: 'ABU_FS5', color: '#3498db', shape: 'box', font: { size: 14, color: 'white' } },
        { id: 'ABU_FS6', label: 'ABU_FS6', color: '#3498db', shape: 'box', font: { size: 14, color: 'white' } },
        { id: 'ABU_FS7', label: 'ABU_FS7', color: '3498db', shape: 'box', font: { size: 14, color: 'white' } },
        
        // CPFs
        { id: 'REO_CPF_AGG', label: 'REO_CPF_AGG', color: '#2ecc71', shape: 'ellipse', font: { size: 14, color: 'white' } },
        { id: 'REO_CPF', label: 'REO_CPF', color: '#2ecc71', shape: 'ellipse', font: { size: 14, color: 'white' } },
        { id: 'REO_CPF_NAG', label: 'REO_CPF_NAG', color: '#2ecc71', shape: 'ellipse', font: { size: 14, color: 'white' } },
        { id: 'REO_ABU_CPF_1', label: 'REO_ABU_CPF_1', color: '#2ecc71', shape: 'ellipse', font: { size: 14, color: 'white' } },
        { id: 'REO_ABU_CPF_1_&_2', label: 'REO_ABU_CPF_1_&_2', color: '#2ecc71', shape: 'ellipse', font: { size: 14, color: 'white' } },
        
        // Pipelines
        { id: 'Oil_Pipeline_1', label: 'Oil_Pipeline_1', color: '#f39c12', shape: 'diamond', font: { size: 14, color: 'white' } },
        { id: 'Oil_Pipeline_2', label: 'Oil_Pipeline_2', color: '#f39c12', shape: 'diamond', font: { size: 14, color: 'white' } },
        { id: 'Oil_Pipeline_3', label: 'Oil_Pipeline_3', color: '#f39c12', shape: 'diamond', font: { size: 14, color: 'white' } },
        { id: 'Oil_Pipeline_4', label: 'Oil_Pipeline_4', color: '#f39c12', shape: 'diamond', font: { size: 14, color: 'white' } },
        { id: 'Oil_Pipeline_5', label: 'Oil_Pipeline_5', color: '#f39c12', shape: 'diamond', font: { size: 14, color: 'white' } },
        { id: 'Gas_Pipeline_1', label: 'Gas_Pipeline_1', color: '#f39c12', shape: 'diamond', font: { size: 14, color: 'white' } },
        { id: 'Gas_Pipeline_2', label: 'Gas_Pipeline_2', color: '#f39c12', shape: 'diamond', font: { size: 14, color: 'white' } },
        { id: 'Gas_Pipeline_2a', label: 'Gas_Pipeline_2a', color: '#f39c12', shape: 'diamond', font: { size: 14, color: 'white' } },
        { id: 'Gas_Pipeline_3', label: 'Gas_Pipeline_3', color: '#f39c12', shape: 'diamond', font: { size: 14, color: 'white' } },
        { id: 'Gas_Pipeline_4', label: 'Gas_Pipeline_4', color: '#f39c12', shape: 'diamond', font: { size: 14, color: 'white' } },
        { id: 'Gas_Pipeline_5', label: 'Gas_Pipeline_5', color: '#f39c12', shape: 'diamond', font: { size: 14, color: 'white' } },
        
        // Other components
        { id: 'Dehydration_Unit', label: 'Dehydration_Unit', color: '#9b59b6', shape: 'triangle', font: { size: 14, color: 'white' } },
        { id: 'Gas_Customer_1', label: 'Gas_Customer_1', color: '#1abc9c', shape: 'database', font: { size: 14, color: 'white' } },
        { id: 'Gas_Customer_2', label: 'Gas_Customer_2', color: '#1abc9c', shape: 'database', font: { size: 14, color: 'white' } },
        { id: 'FCOT', label: 'FCOT', color: '#e67e22', shape: 'hexagon', font: { size: 14, color: 'white' } },
        
        // Additional nodes
        { id: 'REO_GP1', label: 'REO_GP1', color: '#3498db', shape: 'box', font: { size: 14, color: 'white' } },
        { id: 'REO_GP2', label: 'REO_GP2', color: '#3498db', shape: 'box', font: { size: 14, color: 'white' } },
        { id: 'REO_GP3', label: 'REO_GP3', color: '#3498db', shape: 'box', font: { size: 14, color: 'white' } },
        { id: 'REO_GP4', label: 'REO_GP4', color: '#3498db', shape: 'box', font: { size: 14, color: 'white' } },
        { id: 'REO_GP5', label: 'REO_GP5', color: '#3498db', shape: 'box', font: { size: 14, color: 'white' } },
      ]);
      
      // Define edges
      const edges = new DataSet([
        // ABU_FS1 connections
        { from: 'ABU_FS1', to: 'Oil_Pipeline_1', arrows: 'to' },
        { from: 'Oil_Pipeline_1', to: 'FCOT', arrows: 'to' },
        { from: 'ABU_FS1', to: 'REO_CPF_AGG', arrows: 'to' },
        { from: 'REO_CPF_AGG', to: 'REO_CPF', arrows: 'to' },
        { from: 'REO_CPF', to: 'Gas_Pipeline_2', arrows: 'to' },
        { from: 'Gas_Pipeline_2', to: 'Gas_Customer_1', arrows: 'to' },
        
        // ABU_FS3 connections
        { from: 'ABU_FS3', to: 'Oil_Pipeline_1', arrows: 'to' },
        { from: 'ABU_FS3', to: 'REO_CPF_AGG', arrows: 'to' },
        
        // ABU_FS4 connections
        { from: 'ABU_FS4', to: 'Oil_Pipeline_1', arrows: 'to' },
        { from: 'ABU_FS4', to: 'REO_CPF_AGG', arrows: 'to' },
        
        // ABU_FS5 connections
        { from: 'ABU_FS5', to: 'Oil_Pipeline_1', arrows: 'to' },
        { from: 'ABU_FS5', to: 'REO_CPF_AGG', arrows: 'to' },
        
        // ABU_FS2 connections
        { from: 'ABU_FS2', to: 'REO_CPF', arrows: 'to' },
        { from: 'REO_CPF', to: 'Oil_Pipeline_1', arrows: 'to' },
        { from: 'ABU_FS2', to: 'REO_CPF_AGG', arrows: 'to' },
        
        // REO_GP1 connections
        { from: 'REO_GP1', to: 'REO_CPF', arrows: 'to' },
        { from: 'REO_GP1', to: 'REO_CPF_NAG', arrows: 'to' },
        { from: 'REO_CPF_NAG', to: 'REO_CPF', arrows: 'to' },
        
        // REO_GP3 connections
        { from: 'REO_GP3', to: 'Oil_Pipeline_1', arrows: 'to' },
        { from: 'REO_GP3', to: 'Gas_Pipeline_1', arrows: 'to' },
        { from: 'Gas_Pipeline_1', to: 'Gas_Pipeline_2', arrows: 'to' },
        
        // REO_GP2 connections
        { from: 'REO_GP2', to: 'Oil_Pipeline_2', arrows: 'to' },
        { from: 'Oil_Pipeline_2', to: 'FCOT', arrows: 'to' },
        { from: 'REO_GP2', to: 'Dehydration_Unit', arrows: 'to' },
        { from: 'Dehydration_Unit', to: 'Gas_Pipeline_2a', arrows: 'to' },
        { from: 'Gas_Pipeline_2a', to: 'Gas_Customer_2', arrows: 'to' },
        
        // ABU_FS6 connections
        { from: 'ABU_FS6', to: 'REO_ABU_CPF_1', arrows: 'to' },
        { from: 'REO_ABU_CPF_1', to: 'Oil_Pipeline_3', arrows: 'to' },
        { from: 'Oil_Pipeline_3', to: 'REO_ABU_CPF_1_&_2', arrows: 'to' },
        { from: 'REO_ABU_CPF_1_&_2', to: 'Oil_Pipeline_5', arrows: 'to' },
        { from: 'Oil_Pipeline_5', to: 'FCOT', arrows: 'to' },
        { from: 'ABU_FS6', to: 'REO_ABU_CPF_1', arrows: 'to' },
        { from: 'REO_ABU_CPF_1', to: 'Gas_Pipeline_3', arrows: 'to' },
        { from: 'Gas_Pipeline_3', to: 'REO_ABU_CPF_1_&_2', arrows: 'to' },
        { from: 'REO_ABU_CPF_1_&_2', to: 'Gas_Pipeline_5', arrows: 'to' },
        { from: 'Gas_Pipeline_5', to: 'Gas_Customer_2', arrows: 'to' },
        
        // REO_GP4 connections
        { from: 'REO_GP4', to: 'REO_ABU_CPF_1', arrows: 'to' },
        
        // ABU_FS7 connections
        { from: 'ABU_FS7', to: 'Oil_Pipeline_4', arrows: 'to' },
        { from: 'Oil_Pipeline_4', to: 'REO_ABU_CPF_1_&_2', arrows: 'to' },
        { from: 'ABU_FS7', to: 'Gas_Pipeline_4', arrows: 'to' },
        
        // REO_GP5 connections
        { from: 'REO_GP5', to: 'Oil_Pipeline_4', arrows: 'to' },
        { from: 'REO_GP5', to: 'Gas_Pipeline_4', arrows: 'to' },
      ]);
      
      // Provide the data in the vis format
      const data = {
        nodes: nodes,
        edges: edges
      };
      
      const options = {
        layout: {
          improvedLayout: true,
          hierarchical: {
            enabled: false,
            direction: 'LR',
            sortMethod: 'directed'
          }
        },
        physics: {
          enabled: true,
          stabilization: true
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
            color: '#ffffff',
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
      this.surfaceNetwork = new Network(container, data, options);
    },
    initSubsurfaceNetwork() {
      const container = this.$refs.subsurfaceNetwork;
      
      // Create a sample of wells and facilities for visualization
      const nodes = new DataSet([
        // Facilities
        { id: 'ABU_FS1', label: 'ABU_FS1', color: '#3498db', shape: 'box', font: { size: 14, color: 'white' } },
        { id: 'ABU_FS2', label: 'ABU_FS2', color: '#3498db', shape: 'box', font: { size: 14, color: 'white' } },
        { id: 'ABU_FS3', label: 'ABU_FS3', color: '#3498db', shape: 'box', font: { size: 14, color: 'white' } },
        { id: 'ABU_FS4', label: 'ABU_FS4', color: '#3498db', shape: 'box', font: { size: 14, color: 'white' } },
        { id: 'ABU_FS5', label: 'ABU_FS5', color: '#3498db', shape: 'box', font: { size: 14, color: 'white' } },
        { id: 'ABU_FS6', label: 'ABU_FS6', color: '#3498db', shape: 'box', font: { size: 14, color: 'white' } },
        { id: 'ABU_FS7', label: 'ABU_FS7', color: '#3498db', shape: 'box', font: { size: 14, color: 'white' } },
        { id: 'REO_GP1', label: 'REO_GP1', color: '#3498db', shape: 'box', font: { size: 14, color: 'white' } },
        { id: 'REO_GP2', label: 'REO_GP2', color: '#3498db', shape: 'box', font: { size: 14, color: 'white' } },
        { id: 'REO_GP3', label: 'REO_GP3', color: '#3498db', shape: 'box', font: { size: 14, color: 'white' } },
        { id: 'REO_GP4', label: 'REO_GP4', color: '#3498db', shape: 'box', font: { size: 14, color: 'white' } },
        { id: 'REO_GP5', label: 'REO_GP5', color: '#3498db', shape: 'box', font: { size: 14, color: 'white' } },
        
        // Sample wells (just a subset for visualization)
        { id: 'FO10D40T_FO10', label: 'FO10D40T', color: '#e74c3c', shape: 'dot', font: { size: 12, color: 'white' } },
        { id: 'FO10W01T_FO10', label: 'FO10W01T', color: '#e74c3c', shape: 'dot', font: { size: 12, color: 'white' } },
        { id: 'FO11_HAT_FO11', label: 'FO11_HAT', color: '#e74c3c', shape: 'dot', font: { size: 12, color: 'white' } },
        { id: 'FO11HA0T_FO11', label: 'FO11HA0T', color: '#e74c3c', shape: 'dot', font: { size: 12, color: 'white' } },
        { id: 'FO11HA1T_FO11', label: 'FO11HA1T', color: '#e74c3c', shape: 'dot', font: { size: 12, color: 'white' } },
        { id: 'FO11HA2T_FO11', label: 'FO11HA2T', color: '$e74c3c', shape: 'dot', font: { size: 12, color: 'white' } },
        { id: 'FO11HA3T_FO11', label: 'FO11HA3T', color: '#e74c3c', shape: 'dot', font: { size: 12, color: 'white' } },
        { id: 'FO11HA4T_FO11', label: 'FO11HA4T', color: '#e74c3c', shape: 'dot', font: { size: 12, color: 'white' } },
        { id: 'FO11HA5T_FO11', label: 'FO11HA5T', color: '#e74c3c', shape: 'dot', font: { size: 12, color: 'white' } },
        { id: 'FO11HA6T_FO11', label: 'FO11HA6T', color: '#e74c3c', shape: 'dot', font: { size: 12, color: 'white' } },
        { id: 'FO11HA7T_FO11', label: 'FO11HA7T', color: '#e74c3c', shape: 'dot', font: { size: 12, color: 'white' } },
      ]);
      
      // Define edges (sample connections)
      const edges = new DataSet([
        { from: 'FO10D40T_FO10', to: 'ABU_FS1', arrows: 'to' },
        { from: 'FO10W01T_FO10', to: 'REO_GP1', arrows: 'to' },
        { from: 'FO11_HAT_FO11', to: 'REO_GP4', arrows: 'to' },
        { from: 'FO11HA0T_FO11', to: 'REO_GP4', arrows: 'to' },
        { from: 'FO11HA1T_FO11', to: 'REO_GP4', arrows: 'to' },
        { from: 'FO11HA2T_FO11', to: 'REO_GP4', arrows: 'to' },
        { from: 'FO11HA3T_FO11', to: 'REO_GP4', arrows: 'to' },
        { from: 'FO11HA4T_FO11', to: 'REO_GP4', arrows: 'to' },
        { from: 'FO11HA5T_FO11', to: 'REO_GP4', arrows: 'to' },
        { from: 'FO11HA6T_FO11', to: 'REO_GP4', arrows: 'to' },
        { from: 'FO11HA7T_FO11', to: 'REO_GP4', arrows: 'to' },
      ]);
      
      // Provide the data in the vis format
      const data = {
        nodes: nodes,
        edges: edges
      };
      
      const options = {
        layout: {
          improvedLayout: true,
          hierarchical: {
            enabled: true,
            direction: 'UD',
            sortMethod: 'directed'
          }
        },
        physics: {
          enabled: true,
          stabilization: true
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
            color: '#ffffff',
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
      this.subsurfaceNetwork = new Network(container, data, options);
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

body {
  background: linear-gradient(135deg, #0c2461 0%, #1e3799 100%);
  color: #fff;
  min-height: 100vh;
  padding: 20px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.description {
  font-size: 1.1rem;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  gap: 10px;
}

.tab {
  padding: 12px 25px;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab:hover {
  background: rgba(255, 255, 255, 0.25);
}

.tab.active {
  background: #ff9f43;
  color: #2f3640;
  box-shadow: 0 4px 15px rgba(255, 159, 67, 0.4);
}

.network-container {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  height: 600px;
  position: relative;
  overflow: hidden;
}

.network-title {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #ff9f43;
  text-align: center;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.legend-text {
  font-size: 0.9rem;
}

.footer {
  text-align: center;
  margin-top: 30px;
  padding: 20px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 768px) {
  .network-container {
    height: 400px;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .tabs {
    flex-wrap: wrap;
  }
}
</style>