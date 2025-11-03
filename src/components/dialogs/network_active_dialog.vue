<template>
  <q-card style="min-width: 90%;">
    <q-toolbar class="bg-secondary text-primary">
      <q-toolbar-title class="text-caption">
        {{ dialogTitle }}
      </q-toolbar-title>
      <div class="button-group-container">
        <q-btn-group 
            push 
            class="row q-pa-sm bg-secondary text-primary items-stretch"
            flat>
            <q-btn 
            v-for="toolbarItem in toolbarItems"
            :key="toolbarItem.id"
            class="col" 
            color="accent" 
            glossy text-color="primary" 
            push 
            :label="toolbarItem.title" 
            :style="toolbarItem?.style" 
            @click="toolBarItemClick(toolbarItem?.title2)"
            size="sm">
            <q-menu v-if="toolbarItem.visible">
                <q-list dense style="min-width: 100px">
                    <q-item 
                    v-for="inputListItem in inputList"
                    :key="inputListItem.id"
                    clickable 
                    v-close-popup
                    @click="inputClick(inputListItem?.title2)">
                        <q-item-section>{{ inputListItem.title }}</q-item-section>
                    </q-item>
                </q-list>
                </q-menu>
            </q-btn>
        </q-btn-group>
        </div>
      <q-btn flat round dense icon="close" v-close-popup size="sm" />
    </q-toolbar>

    <q-card-section v-if="isDataLoaded"
    class="q-pt-md scroll-container">
      <DrainagePointComponent
      :selectedComponent="selectedComponent"
      :dpResultVisible="dpResultVisible"
      :dpInputVisible="dpInputVisible"
      :dpIPRInputVisible="dpIPRInputVisible"
      :dpConstraintsVisible="dpConstraintsVisible"
      :dpScheduleVisible="dpScheduleVisible"
      :dpVLPInputVisible="dpVLPInputVisible"
      :dpDCAInputVisible="dpDCAInputVisible"
      :dpInputConfigureVisible="dpInputConfigureVisible"
      :activeDrainagePoint="activeDrainagePoint"
      @updateActiveAssetInput="updateActiveAssetInput"
      @updateEditableTable="updateEditableTable"/>
    </q-card-section>

     <div v-show="!isDataLoaded" class="spinner-container">
        <q-spinner color="secondary" size="8em" :thickness="10" />
      </div>

  </q-card>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue';
import DrainagePointComponent from '../drainage_point/drainage_point_component.vue';
import { 
  findConfigInput,  
  createConfigInput,
  findDCAInput,
  createDCAInput,
  findIPRInput,
  createIPRInput,
  createVLPInput,
  findConstraintsInput,
  createConstraints,
  findSchedulesInput,
  createSchedules
} from '../../api_services/drainage_point_input';
import { constraintConditions , constraintUnits } from "../../constants/initial_assets";

export default defineComponent({
  name: 'NetworkActiveDialog',
  components:{
    DrainagePointComponent
  },
  props: {
    selectedComponent: {
      type: Object,
      default: () => ({})
    },
  },
  emits: ['saved', 'cancel', 'updateActiveAssetInput', 'updateEditableTable'],
  setup(props, { emit }) {
    console.log("props.selectedComponent: ", props.selectedComponent)
    const dataStatusOptions = [
      { label: 'No Data', value: 'no-data' },
      { label: 'Partial Data', value: 'partial' },
      { label: 'Complete Data', value: 'complete' }
    ];

    const dialogTitle = ref(`${props.selectedComponent?.label}-${props.selectedComponent?.nodeType }`)
    const toolbarItems = ref(props.selectedComponent?.toolbarItems?.map((row) => row));
    const inputList = ref(props.selectedComponent?.inputList?.map((row) => row));
    const dpResultVisible = ref(false);
    const dpIPRInputVisible = ref(false);
    const dpConstraintsVisible = ref(false);
    const dpScheduleVisible = ref(false);
    const dpVLPInputVisible = ref(false);
    const dpDCAInputVisible = ref(false);
    const dpInputVisible = ref(false);
    const dpInputConfigureVisible = ref(false);
    const isDataLoaded = ref(false);
    const activeDrainagePoint = ref({
        DCA: {
            initialCumProd: null,
            ultimateRecovery: null,
            plateauPeriod: 0,
            selectedDeclineMethod: null,
            rateDeclineRate: null,
            gasFractionDeclineRate: null,
            waterFractionDeclineRate: null,
        },
        IPR: {
            selectedIPRType: null,
            productivityIndex: null,
            reservoirPressure: null,
            reservoirTemperature: null,
            oilGravity: null,
            gasGravity: null,
            gasFraction: null,
            waterFraction: null,
            waterSalinity: null,
            h2S: null,
            co2: null,
            n2: null,
        },
        VLP: {
            liftCurveName: ""
        },
        Configure: {
            dpName: null,
            selectedWellModel: null,
            onStreamDate: new Date().toISOString().split('T')[0],
            selectedFluidType: null
        },
        Constraints: [
            { id: 0, abandonmentCondtion: 'Minimum Gas Oil Ratio', abandonmentValue: null, abandonmentUnit: 'scf/stb'},
            { id: 1, abandonmentCondtion: 'Maximum Gas Oil Ratio', abandonmentValue: null, abandonmentUnit: 'scf/stb' },
            { id: 2, abandonmentCondtion: 'Minimum Water Cut', abandonmentValue: null, abandonmentUnit: 'percent'},
            { id: 3, abandonmentCondtion: 'Maximum Water Cut', abandonmentValue: null, abandonmentUnit: 'percent' },
            { id: 4, abandonmentCondtion: 'Minimum Oil Rate', abandonmentValue: null, abandonmentUnit: 'stb/d' },
            { id: 5, abandonmentCondtion: 'Maximum Oil Rate', abandonmentValue: null, abandonmentUnit: 'stb/d' },
            { id: 6, abandonmentCondtion: 'Maximum Drawdown', abandonmentValue: null, abandonmentUnit: 'psia' },
            { id: 7, abandonmentCondtion: 'Minimum Pwf', abandonmentValue: null, abandonmentUnit: 'psia' }, //Min Pwf = Max THP
            ],
        Schedule: Array(20).fill().map((_, idx)=> {
            return {
                id: idx,
                scheduleDate: null,
                eventType: null,
                constraintType: null,
                newValue: null,
                scheduleUnit: null,
            }
        })
    })

    const initializeDPInputViews = () => {

      dpIPRInputVisible.value = false;
      dpConstraintsVisible.value = false;
      dpScheduleVisible.value = false;
      dpVLPInputVisible.value = false;
      dpDCAInputVisible.value = false;
      dpInputConfigureVisible.value = false;
    }

    const initializeToolbarViews = () => {

      dpInputVisible.value = false;
      dpResultVisible.value = false;
    }

    const toolBarItemClick = async (title2) => {
        console.log("title2: ", title2)
        initializeToolbarViews();
        let title = "";

        switch(title2){

            case "DP-Input":
                dpInputVisible.value = true;
                break;
            case "DP-Results":
                dpResultVisible.value = true;
                title = "Forecast Result";
                //console.log("dpResultVisible.value: ", dpResultVisible.value)
                break;
            case "DP-Plot":
                break;
            case "DP-Save":
              debugger;
              await saveDrainagePointInput();
              emit('saved', props.selectedComponent);
              break;
        }

        dialogTitle.value = `${props.selectedComponent?.label} - ${props.selectedComponent?.nodeType } - ${title}`;
    }

    const inputClick = (title2) => {
        initializeDPInputViews();

        let title = "";

        switch(title2){
            case "DP-Configure":
                dpInputConfigureVisible.value = true;
                title = "Configure";
                break;
            case "DP-DCA":
                dpDCAInputVisible.value = true;
                title = "DCA Input";
                break;
            case "DP-IPR":
                dpIPRInputVisible.value = true;
                title = "IPR";
                break;
            case "DP-VLP":
                title = "VLP";
                dpVLPInputVisible.value = true;
                break;
            case "DP-Constraints":
                dpConstraintsVisible.value = true;
                title = "Constraints";
                break;
            case "DP-Schedule":
                dpScheduleVisible.value = true;
                title = "Schedule";
                break;
        }

        dialogTitle.value = `${props.selectedComponent?.label} - ${props.selectedComponent?.nodeType } - ${title}`;
    }

    const loadDrainagePointConfigInput = async () => {

      //assetGroupId
      const  drainagePointId = props.selectedComponent?.assetId;
      const  assetGroupId = props.selectedComponent?.assetGroupId;

      const dpConfigInputResponse = await findConfigInput(drainagePointId, assetGroupId);
      console.log("dpConfigInputResponse: ", dpConfigInputResponse);
      if(dpConfigInputResponse){
        updateActiveAssetInput({
          value: dpConfigInputResponse.onStreamDate,
          variable: "onStreamDate",
          modelName: "Configure"
        });
        

        updateActiveAssetInput({
          value: dpConfigInputResponse.selectedWellModel,
          variable: "selectedWellModel",
          modelName: "Configure"
        });

        updateActiveAssetInput({
          value:  dpConfigInputResponse.selectedWellType,
          variable: "selectedWellType",
          modelName: "Configure"
        });

        updateActiveAssetInput({
          value: dpConfigInputResponse.selectedFluidType,
          variable: "selectedFluidType",
          modelName: "Configure"
        });
      }
      
    }

    const loadDrainagePointDCAInput = async () => {

      //assetGroupId
      const  drainagePointId = props.selectedComponent?.assetId;
      const  assetGroupId = props.selectedComponent?.assetGroupId;

      const response = await findDCAInput(drainagePointId, assetGroupId);
      console.log("dca-response: ", response);
      if(response){
        updateActiveAssetInput({
          value: response.initialCumProd,
          variable: "initialCumProd",
          modelName: "DCA"
        });
        

        updateActiveAssetInput({
          value: response.ultimateRecovery,
          variable: "ultimateRecovery",
          modelName: "DCA"
        });

        updateActiveAssetInput({
          value: response.plateauPeriod,
          variable: "plateauPeriod",
          modelName: "DCA"
        });

        updateActiveAssetInput({
          value: response.selectedDeclineMethod,
          variable: "selectedDeclineMethod",
          modelName: "DCA"
        });

        updateActiveAssetInput({
          value: response.rateDeclineRate,
          variable: "rateDeclineRate",
          modelName: "DCA"
        });

        updateActiveAssetInput({
          value: response.gasFractionDeclineRate,
          variable: "gasFractionDeclineRate",
          modelName: "DCA"
        });

        updateActiveAssetInput({
          value: response.waterFractionDeclineRate,
        variable: "waterFractionDeclineRate",
        modelName: "DCA"
        });
      }
      
    }

    const loadDrainagePointIPRInput = async () => {

      //assetGroupId
      const  drainagePointId = props.selectedComponent?.assetId;
      const  assetGroupId = props.selectedComponent?.assetGroupId;

      const response = await findIPRInput(drainagePointId, assetGroupId);
      console.log("ipr-response: ", response);
      if(response){
        updateActiveAssetInput({
          value: response.selectedIPRType,
          variable: "selectedIPRType",
          modelName: "IPR"
        });
        
        updateActiveAssetInput({
          value: response.reservoirPressure,
          variable: "reservoirPressure",
          modelName: "IPR"
        });

        updateActiveAssetInput({
          value: response.reservoirTemperature,
          variable: "reservoirTemperature",
          modelName: "IPR"
        });

        updateActiveAssetInput({
          value: response.oilGravity,
          variable: "oilGravity",
          modelName: "IPR"
        });

        updateActiveAssetInput({
          value: response.gasGravity,
          variable: "gasGravity",
          modelName: "IPR"
        });

        updateActiveAssetInput({
          value: response.gasFraction,
          variable: "gasFraction",
          modelName: "IPR"
        });

        updateActiveAssetInput({
          value: response.waterFraction,
          variable: "waterFraction",
          modelName: "IPR"
        });

        updateActiveAssetInput({
          value: response.waterSalinity,
          variable: "waterSalinity",
          modelName: "IPR"
        });

        updateActiveAssetInput({
          value: response.h2S,
          variable: "h2S",
          modelName: "IPR"
        });

        updateActiveAssetInput({
          value: response.co2,
          variable: "co2",
          modelName: "IPR"
        });

        updateActiveAssetInput({
          value: response.n2,
          variable: "n2",
          modelName: "IPR"
        });

        updateActiveAssetInput({
          value: response.productivityIndex,
          variable: "productivityIndex",
          modelName: "IPR"
        });

      }
      
    }

    const loadDrainagePointConstraintsInput = async () => {

      const  drainagePointId = props.selectedComponent?.assetId;
      const  assetGroupId = props.selectedComponent?.assetGroupId;

      const response = await findConstraintsInput(drainagePointId, assetGroupId);
      console.log("dpConstraintInputResponse: ", response);

      let constraints = constraintConditions.map((constraintCondition, idx) => {
                  return {
                      id: idx,
                      abandonmentCondtion: constraintCondition,
                      abandonmentValue: null,
                      abandonmentUnit: constraintUnits[idx],
                      constraintId: null
                  }
              });

      if(response?.length > 0){
            response.forEach((element) => {
                
                const existingConstraintIdx = constraints.findIndex(e => e.abandonmentCondtion === element.abandonmentCondtion);
                if(existingConstraintIdx >= 0){
                    constraints[existingConstraintIdx] = {
                        ...constraints[existingConstraintIdx],
                        ...element,
                        abandonmentUnit: element.abandonmentUnit || constraints[existingConstraintIdx].abandonmentUnit
                    };
                }
            });
      }

      console.log("constraints: ", constraints)

      updateEditableTable({
          value: constraints,
          variable: "Constraints"
        });
      
    }

    const loadDrainagePointSchedulesInput = async () => {

      const  drainagePointId = props.selectedComponent?.assetId;
      const  assetGroupId = props.selectedComponent?.assetGroupId;

      const response = await findSchedulesInput(drainagePointId, assetGroupId);
      console.log("dpConstraintInputResponse: ", response);
      if(response){
        const schedules = Array(50).fill().map((_, idx)=> {

            if(idx < response.length){
              return {
                  id: idx,
                  scheduleDate: response[idx].scheduleDate,
                  eventType: response[idx].eventType,
                  constraintType: response[idx].constraintType,
                  newValue: response[idx].newValue ? Number(response[idx].newValue) : null,
                  scheduleUnit: response[idx].scheduleUnit,
                  scheduleId: response[idx].scheduleId
              }
            }else{
              return {
                  id: idx,
                  scheduleDate: null,
                  eventType: null,
                  constraintType: null,
                  newValue: null,
                  scheduleUnit: null,
                  scheduleId: 0
              }
            }
              
          });

          console.log("schedules: ", schedules)
        updateEditableTable({
          value: [...schedules],
          variable: "Schedule"
        });

      }
      
    }

    const loadDrainagePointInput = async () => {

      await loadDrainagePointConfigInput();
      await loadDrainagePointDCAInput();
      await loadDrainagePointIPRInput();
      await loadDrainagePointConstraintsInput();
      await loadDrainagePointSchedulesInput();

      isDataLoaded.value = true;

    }

    const saveDrainagePointConfigInput = async () => {

      const  drainagePointId = props.selectedComponent?.assetId;
      const  AssetGroupId = props.selectedComponent?.assetGroupId;

      const payload = {
        ...activeDrainagePoint.value.Configure,
        drainagePointId,
        AssetGroupId
      }

      console.log("payload: ", payload)

      const dpConfigInputResponse = await createConfigInput(payload);
      console.log("dpConfigInputResponse: ", dpConfigInputResponse);
    }

    const saveDrainagePointDCAInput = async () => {

      const  drainagePointId = props.selectedComponent?.assetId;
      const  AssetGroupId = props.selectedComponent?.assetGroupId;

      const payload = {
        drainagePointId,
        AssetGroupId,
        initialCumProd: Number(activeDrainagePoint.value.DCA.initialCumProd),
        ultimateRecovery: Number(activeDrainagePoint.value.DCA.ultimateRecovery),
        plateauPeriod: Number(activeDrainagePoint.value.DCA.plateauPeriod),
        selectedDeclineMethod: activeDrainagePoint.value.DCA.selectedDeclineMethod,
        rateDeclineRate: Number(activeDrainagePoint.value.DCA.rateDeclineRate),
        gasFractionDeclineRate: Number(activeDrainagePoint.value.DCA.gasFractionDeclineRate),
        waterFractionDeclineRate: Number(activeDrainagePoint.value.DCA.waterFractionDeclineRate),
      }

      console.log("payload: ", payload)

      const response = await createDCAInput(payload);
      console.log("dca-response: ", response);
    }

    const saveDrainagePointIPRInput = async () => {

      const  drainagePointId = props.selectedComponent?.assetId;
      const  AssetGroupId = props.selectedComponent?.assetGroupId;

      const payload = {
        drainagePointId,
        AssetGroupId,
        selectedIPRType: activeDrainagePoint.value.IPR.selectedIPRType,
        productivityIndex: Number(activeDrainagePoint.value.IPR.productivityIndex),
        reservoirPressure: Number(activeDrainagePoint.value.IPR.reservoirPressure),
        reservoirTemperature:  Number(activeDrainagePoint.value.IPR.reservoirTemperature),
        oilGravity: Number(activeDrainagePoint.value.IPR.oilGravity),
        gasGravity: Number(activeDrainagePoint.value.IPR.gasGravity),
        gasFraction: Number(activeDrainagePoint.value.IPR.gasFraction),
        waterFraction: Number(activeDrainagePoint.value.IPR.waterFraction),
        waterSalinity: Number(activeDrainagePoint.value.IPR.waterSalinity),
        h2S: Number(activeDrainagePoint.value.IPR.h2S),
        co2: Number(activeDrainagePoint.value.IPR.h2S),
        n2: Number(activeDrainagePoint.value.IPR.h2S),
        iprCurveName: activeDrainagePoint.value.Configure.dpName
      }

      console.log("payload: ", payload)

      const response = await createIPRInput(payload);
      console.log("ipr-response: ", response);
    }

    const saveDrainagePointVLPInput = async () => {

      const  drainagePointId = props.selectedComponent?.assetId;
      const  AssetGroupId = props.selectedComponent?.assetGroupId;

      const payload = {
        ...activeDrainagePoint.value.VLP,
        drainagePointId,
        AssetGroupId
      }

      console.log("payload: ", payload)

      const response = await createVLPInput(payload);
      console.log("dpVLPInputResponse: ", response);
    }

    const saveDrainagePointConstraintsInput = async () => {

      const  drainagePointId = props.selectedComponent?.assetId;
      const  AssetGroupId = props.selectedComponent?.assetGroupId;

      const payload = {
        constraints: [],
        drainagePointId,
        AssetGroupId
      }

      activeDrainagePoint.value.Constraints.forEach((row) => {

        if (row.abandonmentValue && String(row.abandonmentValue).trim()) {

              const numericValue = Number(row.abandonmentValue);
              
              if (!isNaN(numericValue)) {
                  payload.constraints.push({
                      constraintId: row?.constraintId || null,
                      abandonmentCondtion: row.abandonmentCondtion,
                      abandonmentValue: numericValue,
                      abandonmentUnit: row.abandonmentUnit?.trim() || "",
                  })
              } else {
                  console.warn(`Invalid number value for ${row.abandonmentCondtion}:`, row.abandonmentValue);
              }
          }
      })

      console.log("payload: ", payload)

      if (payload.constraints.length === 0) {
            console.warn('No valid constraints to save');
            return;
        }

      const response = await createConstraints(payload);
      console.log("dpConstraintsInputResponse: ", response);
    }

    const saveDrainagePointSchedulesInput = async () => {

      const  drainagePointId = props.selectedComponent?.assetId;
      const  AssetGroupId = props.selectedComponent?.assetGroupId;
      const schedules = []

      activeDrainagePoint.value.Schedule.forEach((row) => {

        if(row.scheduleDate){
          schedules.push({
            scheduleId: row.scheduleId,
            scheduleDate: row.scheduleDate,
            eventType: row.eventType,
            constraintType: row.constraintType,
            newValue: row.newValue ? Number(row.newValue) : null,
            scheduleUnit: row.scheduleUnit ?? "",
          });
        }
      }); 

      const payload = {
        schedules,
        drainagePointId,
        AssetGroupId
      }

      console.log("payload: ", payload)

      const response = await createSchedules(payload);
      console.log("dpSchedulesInputResponse: ", response);
    }

    const saveDrainagePointInput = async () => {

      isDataLoaded.value = false;

      await saveDrainagePointConfigInput();
      await saveDrainagePointDCAInput();
      await saveDrainagePointIPRInput();
      await saveDrainagePointVLPInput();
      await saveDrainagePointConstraintsInput();
      await saveDrainagePointSchedulesInput();

      isDataLoaded.value = true;
    }

    const handleSave = async () => {
      //debugger;
      
    };

    const handleCancel = () => {
      emit('cancel');
    };

    const updateActiveAssetInput = (payload) => {

        console.log(payload)

        switch (props.selectedComponent?.nodeType) {
            case "Drainage Point":
                
                activeDrainagePoint.value["Configure"]["dpName"] = props.selectedComponent?.id;
                activeDrainagePoint.value[payload.modelName][payload.variable] = payload.value;
                console.log("activeDrainagePoint.value: ", activeDrainagePoint.value);
                break;

            case "Reservoir":
                
                break;

            case "Field":
                
                break;

            case "Well":
                
                break;
        }
    };

    const updateEditableTable = (payload) => {

        console.log(payload)

        switch (props.selectedComponent?.nodeType) {
            case "Drainage Point":
                
                activeDrainagePoint.value[payload.variable] = payload.value;
                console.log("activeDrainagePoint.value: ", activeDrainagePoint.value);
                break;

            case "Reservoir":
                
                break;

            case "Field":
                
                break;

            case "Well":
                
                break;
        }
    };

    const initializeActiveAssets = () => {

        activeDrainagePoint.value = {
          DCA: {
              initialCumProd: null,
              ultimateRecovery: null,
              plateauPeriod: 0,
              selectedDeclineMethod: null,
              rateDeclineRate: null,
              gasFractionDeclineRate: null,
              waterFractionDeclineRate: null,
          },
          IPR: {
              selectedIPRType: null,
              productivityIndex: null,
              reservoirPressure: null,
              reservoirTemperature: null,
              oilGravity: null,
              gasGravity: null,
              gasFraction: null,
              waterFraction: null,
              waterSalinity: null,
              h2S: null,
              co2: null,
              n2: null,
          },
          VLP: {
              liftCurveName: ""
          },
          Configure: {
              dpName: null,
              selectedWellModel: null,
              onStreamDate: new Date().toISOString().split('T')[0],
              selectedFluidType: null
          },
          Constraints: [
              { id: 0, abandonmentCondtion: 'Minimum Gas Oil Ratio', abandonmentValue: null, abandonmentUnit: 'scf/stb'},
              { id: 1, abandonmentCondtion: 'Maximum Gas Oil Ratio', abandonmentValue: null, abandonmentUnit: 'scf/stb' },
              { id: 2, abandonmentCondtion: 'Minimum Water Cut', abandonmentValue: null, abandonmentUnit: 'percent'},
              { id: 3, abandonmentCondtion: 'Maximum Water Cut', abandonmentValue: null, abandonmentUnit: 'percent' },
              { id: 4, abandonmentCondtion: 'Minimum Oil Rate', abandonmentValue: null, abandonmentUnit: 'stb/d' },
              { id: 5, abandonmentCondtion: 'Maximum Oil Rate', abandonmentValue: null, abandonmentUnit: 'stb/d' },
              { id: 6, abandonmentCondtion: 'Maximum Drawdown', abandonmentValue: null, abandonmentUnit: 'psia' },
              { id: 7, abandonmentCondtion: 'Minimum Pwf', abandonmentValue: null, abandonmentUnit: 'psia' }, //Min Pwf = Max THP
              ],
          Schedule: Array(20).fill().map((_, idx)=> {
              return {
                  id: idx,
                  scheduleDate: null,
                  eventType: null,
                  constraintType: null,
                  newValue: null,
                  scheduleUnit: null,
              }
          })
      };
    }
   

    onMounted(async () => {
      
      switch (props.selectedComponent?.nodeType) {
        case "Drainage Point":
            toolBarItemClick("DP-Input");
            inputClick("DP-Configure");
            initializeActiveAssets();
            await loadDrainagePointInput();
            break;

        case "Reservoir":
            
            break;

        case "Field":
            
            break;

        case "Well":
            
            break;
      }
    });

    return {
      dataStatusOptions,
      handleSave,
      handleCancel,
      inputList,
      toolbarItems,
      dpResultVisible,
      dpIPRInputVisible,
      dpConstraintsVisible,
      dpScheduleVisible,
      dpVLPInputVisible,
      dpDCAInputVisible,
      dpInputVisible,
      dpInputConfigureVisible,
      dialogTitle,
      inputClick,
      toolBarItemClick,
      updateActiveAssetInput,
      activeDrainagePoint,
      updateEditableTable,
      isDataLoaded
    };
  }
});
</script>

<style scoped>
.scroll-container {
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  max-height: calc(100vh - 80px); /* Adjust based on your header height */
}

.scroll-container::-webkit-scrollbar {
  display: none; /* WebKit */
}

.button-group-container {
  flex-shrink: 0;
  /*border-top: 1px solid #e0e0e0;  Optional separator */
  background-color: #0A1D3F;
}

.spinner-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>