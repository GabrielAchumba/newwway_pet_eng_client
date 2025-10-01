<template>
  <q-page class="bg-primary">
    <div class="row full-height">
      <!-- Left Section (Wider) -->
      <div class="col-9 q-pa-md">
        <!-- First Component: Top Toolbox -->
        <div class="row items-center q-mb-md">
          <div class="col">
            <div class="toolbox-container">
              <q-btn 
                :icon="showChart ? 'table_chart' : 'show_chart'" 
                @click="toggleChartTable"
                class="toolbox-btn"
                dense
                size="sm"
              >
                <q-tooltip>
                  {{ showChart ? 'Show Table' : 'Show Chart' }}
                </q-tooltip>
              </q-btn>
              
              <q-btn 
                @click="activateTool('ipr')"
                class="toolbox-btn"
                dense
                size="sm"
              >
                IPR
                <!-- <img :src="iprIcon" alt="IPR" class="toolbox-img" />
                <q-tooltip>IPR</q-tooltip> -->
              </q-btn>
              
              <q-btn 
                @click="activateTool('vlp')"
                class="toolbox-btn"
                dense
                size="sm"
              >
                VLP
                <!-- <img src="~assets/vlp-icon.png" alt="VLP" class="toolbox-img" /> -->
                <!-- <q-tooltip>VLP</q-tooltip> -->
              </q-btn>
              
              <q-btn 
                @click="activateTool('iprVlp')"
                class="toolbox-btn"
                dense
                size="sm"
              >
                IPR+VLP
                <!-- <img src="~assets/ipr-vlp-icon.png" alt="IPR+VLP" class="toolbox-img" /> -->
                <!-- <q-tooltip>IPR+VLP</q-tooltip> -->
              </q-btn>
            </div>
          </div>
        </div>

        <!-- Second Component: Table or Chart -->
        <div class="content-container">
          <div v-show="!showChart" class="table-section">
            <q-table
              :rows="tableData"
              :columns="columns"
              row-key="sn"
              flat
              bordered
              class="bg-white"
            />
          </div>
          
          <div v-show="showChart" class="chart-section">
            <div ref="chartContainer" class="plotly-chart"></div>
          </div>
        </div>
      </div>

      <!-- Right Section (Narrower) - Third Component -->
      <div class="col-3 q-pa-md">
        <RightPane 
          :liftCurves="liftCurvesNames"
          :selected-curve="selectedCurve"
          :rate="currentRate"
          :pwf="currentPwf"
          @curve-change="onCurveChange"
          @ipr-update="onIprUpdate"
          @sensitivity-selected="onVLPSensitivitySelected"
          :vlpSensitivitiesPaneProp="vlpSensitivitiesPaneProp"
          :vlpSensitivitiesProp="vlpSensitivitiesProp"
          :vlpSensitivityTitleProp="vlpSensitivityTitle"
          :selectedSensitivityIdProp="selectedSensitivityId"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import Plotly from 'plotly.js-dist'
import RightPane from './right-pane.vue'
import { storeToRefs } from 'pinia';
import { useAuthStore } from 'src/store/modules/authStore';
import { usePropertyGridStore } from 'src/store/modules/propertyGridStore';
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';
import { useAssetGroupsStore } from 'src/store/modules/assetGroupsStore';
import { findLiftCurvesNamesPerDrainagePoint, findOneLiftCurves } from 'src/api_services/well_modeling';
import IPRIcon from 'src/assets/images/ipr-icon.png';

const authStore = useAuthStore();
const propertyGridStore = usePropertyGridStore();
const assetsExplorerStore = useAssetsExplorerStore();
const assetGroupsStore = useAssetGroupsStore();

const { listItems } = storeToRefs(assetsExplorerStore);
const { activeDrainagePoint } = storeToRefs(assetGroupsStore);

export default {
  name: 'WellLiftCurvesLanding',
  components: {
    RightPane
  },
  setup() {
    const showChart = ref(false)
    const chartContainer = ref(null)
    const selectedCurve = ref('Select Lift Curves')
    const currentRate = ref(0)
    const currentPwf = ref(0)
    const iprIcon = ref(IPRIcon);
    const liftCurvesNames = ref([{ label: 'Select Lift Curves', value: 'Select Lift Curves' }])
    const vlpSensitivitiesPaneProp = ref(true)
    const vlpSensitivitiesProp = ref([])
    const liftCurvesRecord = ref({});
    const vlpSensitivityTitle = ref("");
    const selectedSensitivityId = ref("");

    const vlpSensitivityVariables = ref({
        'Water Cut': "WC", 
        'Water Gas Ratio': "WGR",
        'Water Oil Ratio': "WOR", 
        'Gas Oil Ratio': "GOR", 
        'Condensate Rate Ratio': "CGR", 
        'GLR Free': "GLRFree",
        'Free Gas Rate': "FreeGasRate",
        'GOR Free': "GORFree",
        'Total GOR': "TotalGOR",
        'Dissolved and Free GLR': "DissolvedFreeGLR",
        'First Node Pressure': "FirstNodePressure",
        'Tubing Roughness': "TubingRoughness",
        'Downhole Heat Transfer Coefficient': "'DownholeHeatTransferCoefficient'"
    })
    
    // Table data

    const tableData = ref([])

    const columns = [
      { name: 'sn', label: 'SN', field: 'sn', align: 'left', sortable: true },
      { name: 'rate', label: 'Rate', field: 'rate', align: 'left', sortable: true },
      { name: 'fbhPressure', label: 'FBH Pressure', field: 'fbhPressure', align: 'left', sortable: true },
      { name: 'fwhTemperature', label: 'FWH Temperature', field: 'fwhTemperature', align: 'left', sortable: true }
    ]

    // Chart data
    const chartData = ref([
      {
        x: tableData.value.map(row => row.rate),
        y: tableData.value.map(row => row.fbhPressure),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'FBH Pressure',
        line: { color: '#E2372D' }
      },
    //   {
    //     x: tableData.value.map(row => row.rate),
    //     y: tableData.value.map(row => row.fwhTemperature),
    //     type: 'scatter',
    //     mode: 'lines+markers',
    //     name: 'FWH Temperature',
    //     yaxis: 'y2',
    //     line: { color: '#0A1D3F' }
    //   }
    ])

    const chartLayout = {
      title: 'Production Analysis',
      xaxis: {
        title: 'Rate'
      },
      yaxis: {
        title: 'FBH Pressure',
        titlefont: { color: '#E2372D' },
        tickfont: { color: '#E2372D' }
      },
    //   yaxis2: {
    //     title: 'FWH Temperature',
    //     titlefont: { color: '#0A1D3F' },
    //     tickfont: { color: '#0A1D3F' },
    //     overlaying: 'y',
    //     side: 'right'
    //   },
      plot_bgcolor: '#F0F4F8',
      paper_bgcolor: '#FFFFFF',
      margin: { t: 50, r: 50, b: 50, l: 50 }
    }

    const updateChartData = (newTableData) => {
        console.log("newTableData: ", newTableData)

        chartData.value = [
            {
                x: newTableData.map(row => row.rate),
                y: newTableData.map(row => row.fbhPressure),
                type: 'scatter',
                mode: 'lines+markers',
                name: 'FBH Pressure',
                line: { color: '#E2372D' }
            },
            // {
            //     x: newTableData.map(row => row.rate),
            //     y: newTableData.map(row => row.fwhTemperature),
            //     type: 'scatter',
            //     mode: 'lines+markers',
            //     name: 'FWH Temperature',
            //     yaxis: 'y2',
            //     line: { color: '#0A1D3F' }
            // }
        ]

        // Update Plotly if chart is visible
        if (showChart.value && chartContainer.value) {
            Plotly.react(chartContainer.value, chartData.value, chartLayout, { responsive: true });
        }
    }

    const toggleChartTable = () => {
      showChart.value = !showChart.value
        console.log(showChart.value, chartContainer.value, chartData.value, chartLayout)
      if (showChart.value && chartContainer.value) {
        // Use nextTick to ensure DOM is updated
        setTimeout(() => {
          Plotly.newPlot(chartContainer.value, chartData.value, chartLayout, { responsive: true })
        }, 0)
      }
    }

    const onVLPSensitivitySelected = (payload) => {
        console.log(payload)
        updateTableData(payload.id)
    }

    const updateTableData = (vlpSensitivitySelected) => {
        console.log("vlpSensitivitySelected: ", vlpSensitivitySelected)
        const selectedCalulatedVariables = liftCurvesRecord.value.liftCurves[vlpSensitivitySelected];
        console.log(selectedCalulatedVariables)
        tableData.value = selectedCalulatedVariables.Rate.map((row, idx) => {
            return {
               sn: idx+1,
               rate: row, 
               fbhPressure: selectedCalulatedVariables.VLP_Pressure[idx], 
               fwhTemperature: selectedCalulatedVariables.Well_Head_Temperature[idx]
            }
        })
        console.log("tableData.value: ", tableData.value);
    }

    const activateTool = (tool) => {
      console.log(`Activated tool: ${tool}`)
      // Implement tool-specific functionality here
    }

    const onCurveChange = (curve) => {
      selectedCurve.value = curve
      // Handle curve change logic
    }

    const onIprUpdate = (iprData) => {
      console.log('IPR data updated:', iprData)
      // Handle IPR data update
    }

    const getLiftCurvesNamesPerDrainagePoint= async () =>{

        const assetGroupId = assetGroupsStore.selectedAssetGroup.id;
        console.log("assetGroupId: ", assetGroupId);
        const drainagePointId = assetGroupsStore.activeDrainagePoint.id;
        console.log("drainagePointId: ", drainagePointId);

        const payload = {
            drainagePointId,
            assetGroupId,
        }
        const liftCurvesNamesResponse = await findLiftCurvesNamesPerDrainagePoint(payload);
        if(liftCurvesNamesResponse.status == 200 || liftCurvesNamesResponse.status == 201){
            liftCurvesNames.value = liftCurvesNamesResponse.data.liftCurvesRecords.map((row) => {
                return {
                    label: row.liftCurveName,
                    value: row.liftCurveName
                };
            })

            selectedCurve.value = liftCurvesNamesResponse.data.liftCurvesRecords[0].liftCurveName;
            if(liftCurvesNamesResponse.data.firstLiftCurvesRecord){
                liftCurvesRecord.value = {...liftCurvesNamesResponse.data.firstLiftCurvesRecord};
                const liftCurvesKeys = Object.keys(liftCurvesNamesResponse.data.firstLiftCurvesRecord.liftCurves);
                vlpSensitivitiesProp.value = liftCurvesKeys.map((liftCurvesKey) => {
                    return {
                        id: liftCurvesKey,
                        name: liftCurvesKey
                    };
                })
                const senVar1Name = liftCurvesNamesResponse.data.firstLiftCurvesRecord.SensitivityVariable1Name;
                const senVar2Name = liftCurvesNamesResponse.data.firstLiftCurvesRecord.SensitivityVariable2Name;
                const senVar3Name = liftCurvesNamesResponse.data.firstLiftCurvesRecord.SensitivityVariable3Name;
                vlpSensitivityTitle.value = "VLP Sensitivities\n" + `${vlpSensitivityVariables.value[senVar1Name]}_${vlpSensitivityVariables.value[senVar2Name]}_${vlpSensitivityVariables.value[senVar3Name]}`
                if(vlpSensitivitiesProp.value.length > 0){
                    selectedSensitivityId.value = vlpSensitivitiesProp.value[0].id;
                }

                console.log("liftCurvesKeys: ", liftCurvesKeys);
                updateTableData(liftCurvesKeys[0]);
                console.log("vlpSensitivityTitle.value: ", vlpSensitivityTitle.value);
            }
        }
        console.log("liftCurvesNamesResponse: ", liftCurvesNamesResponse);

    }

    watch(listItems, async (newVal, oldVal) => {
        console.log('Message changed from', oldVal, 'to', newVal);
        await getLiftCurvesNamesPerDrainagePoint();
    }, { immediate: true })

    

    watch(activeDrainagePoint, async (newVal, oldVal) => {
        console.log('activeDrainagePoint changed from', oldVal, 'to', newVal);
        await getLiftCurvesNamesPerDrainagePoint();
    }, { immediate: true })

    watch(tableData, (newVal, oldVal) => {
        console.log('tableData changed from', oldVal, 'to', newVal);
        updateChartData(newVal);
    }, { immediate: true })

    onMounted(() => {

        authStore.setStateData("showSpinner", false);
        authStore.setStateData("isError", false);
        authStore.setStateData("errorMessages", "");
        authStore.setStateData("pageTitle", "View Drainage Points Lift Curves"); 
        propertyGridStore.SetIsPropertyGridActivated(false);
        assetsExplorerStore.SetIsAssetsExplorerActivated(true);

    })

    // Cleanup Plotly on component unmount
    onUnmounted(() => {
      if (chartContainer.value) {
        Plotly.purge(chartContainer.value)
      }
    })

    return {
      showChart,
      chartContainer,
      tableData,
      columns,
      selectedCurve,
      liftCurvesNames,
      currentRate,
      currentPwf,
      toggleChartTable,
      activateTool,
      onCurveChange,
      onIprUpdate,
      iprIcon,
      vlpSensitivitiesPaneProp,
      vlpSensitivitiesProp,
      liftCurvesRecord,
      vlpSensitivityVariables,
      vlpSensitivityTitle,
      selectedSensitivityId,
      onVLPSensitivitySelected,
      updateTableData,
      updateChartData
    }
  }
}
</script>

<style scoped>
.toolbox-container {
  display: flex;
  gap: 8px;
  padding: 8px;
  background: #F0F4F8;
  border-radius: 8px;
}

.toolbox-btn {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 4px;
  min-width: 40px;
  min-height: 32px;
}

.toolbox-img {
  width: 32px;
  height: 32px;
  object-fit: cover;
}

.content-container {
  height: calc(100vh - 120px);
  background: #F0F4F8;
  border-radius: 8px;
  padding: 16px;
}

.table-section {
  height: 100%;
  overflow: auto;
}

.chart-section {
  height: 100%;
  width: 100%;
}

.plotly-chart {
  width: 100%;
  height: 100%;
  min-height: 500px;
}

.full-height {
  height: 100vh;
}
</style>