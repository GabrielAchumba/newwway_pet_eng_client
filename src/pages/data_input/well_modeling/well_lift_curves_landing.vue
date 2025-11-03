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
        <!-- <div class="content-container"> -->

          <!-- <div v-show="!showChart" class="table-section"> -->
            <Table
            v-show="!showChart"
            :rows="tableData"
            :columns="columns"
            />
            <!-- <q-table
              :rows="tableData"
              :columns="columns"
              row-key="sn"
              flat
              bordered
              class="bg-white"
            /> -->
          <!-- </div> -->
          
          <!-- <div class="content-container"> -->
            <div v-show="showChart" class="chart-section">
              <div ref="chartContainer" class="plotly-chart"></div>
            </div>
        <!-- </div> -->
      </div>

      <!-- Right Section (Narrower) - Third Component -->
      <div class="col-3 q-pa-md">
        <RightPane 
          :liftCurves="liftCurvesNames"
          :selected-curve="selectedCurve"
          :rate="currentRate"
          :pwf="currentPwf"
          @curve-change="onCurveChange"
          @update-parameter-data="onParameterDataUpdate"
          @sensitivity-selected="onVLPSensitivitySelected"
          :vlpSensitivitiesPaneProp="vlpSensitivitiesPaneProp"
          :vlpSensitivitiesProp="vlpSensitivitiesProp"
          :vlpSensitivityTitleProp="vlpSensitivityTitle"
          :selectedSensitivityIdProp="selectedSensitivityId"
          :parametersDataProp="parametersDataProp"
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
import { findLiftCurvesNamesPerDrainagePoint, findOneLiftCurves, calculateVLP } from 'src/api_services/well_modeling';
import Table from "src/components/controls/table.vue";
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
    RightPane,
    Table
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
    const parametersDataProp = ref([]);
    const sensitivityVariable1Value = ref(0);
    const sensitivityVariable2Value = ref(0);
    const sensitivityVariable3Value = ref(0);

    const vlpSensitivityVariables = ref({
        'Water Cut': {
          name: "WC",
          value: 0,
        }, 
        'Water Gas Ratio': {
          name: "WGR",
          value: 0,
        },
        'Water Oil Ratio': {
          name: "WOR",
          value: 0,
        }, 
        'Gas Oil Ratio': {
          name: "GOR",
          value: 0,
        }, 
        'Condensate Rate Ratio': {
          name: "CGR",
          value: 0,
        }, 
        'GLR Free': {
          name: "GLRFree",
          value: 0,
        },
        'Free Gas Rate': {
          name: "FreeGasRate",
          value: 0,
        },
        'GOR Free': {
          name: "GORFree",
          value: 0,
        },
        'Total GOR': {
          name: "TotalGOR",
          value: 0,
        },
        'Dissolved and Free GLR': {
          name: "DissolvedFreeGLR",
          value: 0,
        },
        'First Node Pressure': {
          name: "FirstNodePressure",
          value: 0,
        },
        'Tubing Roughness': {
          name: "TubingRoughness",
          value: 0,
        },
        'Downhole Heat Transfer Coefficient': {
          name: "DownholeHeatTransferCoefficient",
          value: 0,

        }
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

    const updateTableData2 = (calRates, calFBHPs, calFWHTs) => {
  

        tableData.value = calRates.map((calRate, idx) => {
            return {
               sn: idx+1,
               rate: calRate, 
               fbhPressure: calFBHPs[idx], 
               fwhTemperature: calFWHTs[idx]
            }
        })
        console.log("tableData.value: ", tableData.value);
    }

    const activateTool = async (tool) => {
      console.log(`Activated tool: ${tool}`)
      
      switch(tool){
        case "vlp":
          await calculateVLPCurve();
          break;
      }
    }

    const calculateVLPCurve = async () => {

      const assetGroupId = assetGroupsStore.selectedAssetGroup.id;
      console.log("assetGroupId: ", assetGroupId);
      const drainagePointId = assetGroupsStore.activeDrainagePoint.id;
      console.log("drainagePointId: ", drainagePointId);


      const vlpCalculatorDto = {
        drainagePointId,
        AssetGroupId: assetGroupId,
        liftCurveName: selectedCurve.value,
        SensitivityVariable1Name: liftCurvesRecord.value.SensitivityVariable1Name,
        SensitivityVariable1Value: sensitivityVariable1Value.value,
        SensitivityVariable2Name: liftCurvesRecord.value.SensitivityVariable2Name,
        SensitivityVariable2Value: sensitivityVariable2Value.value,
        SensitivityVariable3Name: liftCurvesRecord.value.SensitivityVariable3Name,
        SensitivityVariable3Value: sensitivityVariable3Value.value,
        wellType: liftCurvesRecord.value.wellType
      }

      console.log("vlpCalculatorDto: ", vlpCalculatorDto);
      
      const vlpCurveResponse = await calculateVLP(vlpCalculatorDto);
      console.log("vlpCurveResponse: ", vlpCurveResponse);
      if(vlpCurveResponse.status == 200 || vlpCurveResponse.status == 201){

        const { rates, results } = vlpCurveResponse.data;
        const calFWHTs = [];
        const calFBHPs = results.map((row, idx) => {

          calFWHTs.push(row.temperature);
          return row.pressure;
        })
        updateTableData2(rates, calFBHPs, calFWHTs)
      }
    }

    const onCurveChange = (curve) => {
      selectedCurve.value = curve
      // Handle curve change logic
    }

    const onParameterDataUpdate = (parameterData) => {
      console.log('IPR data updated:', parameterData)

      if(liftCurvesRecord.value.SensitivityVariable1Name == parameterData.title){
        sensitivityVariable1Value.value = Number(parameterData.value);
        console.log('sensitivityVariable1Value.value: ', sensitivityVariable1Value.value)
      }

      if(liftCurvesRecord.value.SensitivityVariable2Name == parameterData.title){
        sensitivityVariable2Value.value = Number(parameterData.value);
        console.log('sensitivityVariable2Value.value: ', sensitivityVariable2Value.value)
      }

      if(liftCurvesRecord.value.SensitivityVariable3Name == parameterData.title){
        sensitivityVariable3Value.value = Number(parameterData.value);
        console.log('sensitivityVariable3Value.value: ', sensitivityVariable3Value.value)
      }
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
                vlpSensitivityTitle.value = "VLP Sensitivities\n" + `${vlpSensitivityVariables.value[senVar1Name].name}_${vlpSensitivityVariables.value[senVar2Name].name}_${vlpSensitivityVariables.value[senVar3Name].name}`
                if(vlpSensitivitiesProp.value.length > 0){
                    selectedSensitivityId.value = vlpSensitivitiesProp.value[0].id;
                }

                console.log("liftCurvesKeys: ", liftCurvesKeys);
                updateTableData(liftCurvesKeys[0]);
                console.log("vlpSensitivityTitle.value: ", vlpSensitivityTitle.value);
                console.log("senVar1Name: ", senVar1Name);
                console.log("senVar2Name: ", senVar2Name);
                console.log("senVar3Name: ", senVar3Name);
                console.log("vlpSensitivityVariables.value: ", vlpSensitivityVariables.value);

                parametersDataProp.value = [];
                const vlpSensitivityVariablesKeys = Object.keys(vlpSensitivityVariables.value);
                for(const vlpSensitivityVariablesKey of vlpSensitivityVariablesKeys){
                  
                  console.log("vlpSensitivityVariablesKey: ", vlpSensitivityVariablesKey);
                  if(senVar1Name == vlpSensitivityVariablesKey){
                    parametersDataProp.value.push({
                      ...vlpSensitivityVariables.value[vlpSensitivityVariablesKey],
                      title: vlpSensitivityVariablesKey 
                    })
                  }

                  if(senVar2Name == vlpSensitivityVariablesKey){
                    parametersDataProp.value.push({
                      ...vlpSensitivityVariables.value[vlpSensitivityVariablesKey],
                      title: vlpSensitivityVariablesKey 
                    })
                  }

                  if(senVar3Name == vlpSensitivityVariablesKey){
                    parametersDataProp.value.push({
                      ...vlpSensitivityVariables.value[vlpSensitivityVariablesKey],
                      title: vlpSensitivityVariablesKey 
                    })
                  }

                  console.log("parametersDataProp: ", parametersDataProp)
                }
            }
        }
        //console.log("liftCurvesNamesResponse: ", liftCurvesNamesResponse);

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
      onParameterDataUpdate,
      iprIcon,
      vlpSensitivitiesPaneProp,
      vlpSensitivitiesProp,
      liftCurvesRecord,
      vlpSensitivityVariables,
      vlpSensitivityTitle,
      selectedSensitivityId,
      onVLPSensitivitySelected,
      updateTableData,
      updateChartData,
      parametersDataProp,
      sensitivityVariable1Value,
      sensitivityVariable2Value,
      sensitivityVariable3Value
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
  height: 80%;
  width: 100%;
}

.plotly-chart {
  width: 100%;
  height: 80%;
  min-height: 500px;
}

.full-height {
  height: 100vh;
}
</style>