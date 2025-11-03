<template>
    <div>
        <DrainagePointDCAInput
        :activeDrainagePoint="_activeDrainagePoint"
        :selectedComponent="selectedComponent"/>
    </div>
</template>


<script>
import { ref, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia';
import { useAuthStore } from 'src/store/modules/authStore';
import { usePropertyGridStore } from 'src/store/modules/propertyGridStore';
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';
import { useAssetGroupsStore } from 'src/store/modules/assetGroupsStore';
import DrainagePointDCAInput from '../../../../components/drainage_point/input/dca/drainage_point_dca_input.vue'
import { findDCAInput } from "../../../../api_services/drainage_point_input";


const assetGroupsStore = useAssetGroupsStore();
const authStore = useAuthStore();
const propertyGridStore = usePropertyGridStore();
const assetsExplorerStore = useAssetsExplorerStore();

const { listItems } = storeToRefs(assetsExplorerStore);
const { activeDrainagePoint } = storeToRefs(assetGroupsStore);

export default {
  name: 'DrainagePointDCALanding',
  components:{
    DrainagePointDCAInput,
  },
  emits: [],

  setup(props, { emit }) {
    const $q = useQuasar()

    const _activeDrainagePoint = ref({
        DCA: {
            initialCumProd: null,
            ultimateRecovery: null,
            plateauPeriod: 0,
            selectedDeclineMethod: null,
            rateDeclineRate: null,
            gasFractionDeclineRate: null,
            waterFractionDeclineRate: null,
        }
    });
    const selectedComponent = ref({});

    const updateActiveAssetInput = (payload) => {

        console.log(payload)
        _activeDrainagePoint.value[payload.modelName][payload.variable] = payload.value;
        console.log("_activeDrainagePoint.value: ", _activeDrainagePoint.value);
    };

    const loadDrainagePointDCAInput = async () => {

      //assetGroupId
      const  drainagePointId = selectedComponent.value.assetId;
      const  assetGroupId = selectedComponent.value.assetGroupId;

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

     watch(activeDrainagePoint, async (newVal, oldVal) => {
        console.log('activeDrainagePoint changed from', oldVal, 'to', newVal);
        selectedComponent.value = {
            assetId: newVal.id,
            id: newVal.assetGroupName,
            assetGroupId: assetGroupsStore.selectedAssetGroup.id
        }
        console.log("selectedComponent: ", selectedComponent)
        await loadDrainagePointDCAInput();
    }, { immediate: true, deep: true })

    watch(listItems,  (newVal, oldVal) => {
        console.log('listItems changed from', oldVal, 'to', newVal);
        //
       // await getLiftCurvesNamesPerDrainagePoint();
    }, { immediate: true, deep: true })

    onMounted(() => {

        authStore.setStateData("showSpinner", false);
        authStore.setStateData("isError", false);
        authStore.setStateData("errorMessages", "");
        authStore.setStateData("pageTitle", "View Drainage Points Lift Curves"); 
        propertyGridStore.SetIsPropertyGridActivated(false);
        assetsExplorerStore.SetIsAssetsExplorerActivated(true);

    })

    return {
      _activeDrainagePoint,
      selectedComponent
    }
  }
}
</script>

<style scoped>

</style>