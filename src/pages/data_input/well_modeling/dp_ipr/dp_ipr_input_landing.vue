<template>
    <div>
        <DrainagePointConfigureInput
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
import DrainagePointConfigureInput from '../../../../components/drainage_point/input/drainage_point_configure.vue'
import { findConfigInput } from "../../../../api_services/drainage_point_input";


const assetGroupsStore = useAssetGroupsStore();
const authStore = useAuthStore();
const propertyGridStore = usePropertyGridStore();
const assetsExplorerStore = useAssetsExplorerStore();

const { listItems } = storeToRefs(assetsExplorerStore);
const { activeDrainagePoint } = storeToRefs(assetGroupsStore);

export default {
  name: 'DrainagePointConfigureLanding',
  components:{
    DrainagePointConfigureInput,
  },
  emits: [],

  setup(props, { emit }) {
    const $q = useQuasar()

    const _activeDrainagePoint = ref({
        Configure: {
            dpName: null,
            selectedWellModel: null,
            onStreamDate: new Date().toISOString().split('T')[0],
            selectedFluidType: null,
            selectedWellType: null
        }
    });
    const selectedComponent = ref({});

    const updateActiveAssetInput = (payload) => {

        console.log(payload)
        _activeDrainagePoint.value["Configure"]["dpName"] = selectedComponent.value.id;
        _activeDrainagePoint.value[payload.modelName][payload.variable] = payload.value;
        console.log("_activeDrainagePoint.value: ", _activeDrainagePoint.value);
    };

    const loadDrainagePointConfigInput = async () => {

      //assetGroupId
      const  drainagePointId = selectedComponent.value.assetId;
      const  assetGroupId = selectedComponent.value.assetGroupId;

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

     watch(activeDrainagePoint, async (newVal, oldVal) => {
        console.log('activeDrainagePoint changed from', oldVal, 'to', newVal);
        selectedComponent.value = {
            assetId: newVal.id,
            id: newVal.assetGroupName,
            assetGroupId: assetGroupsStore.selectedAssetGroup.id
        }
        console.log("selectedComponent: ", selectedComponent)
        await loadDrainagePointConfigInput();
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