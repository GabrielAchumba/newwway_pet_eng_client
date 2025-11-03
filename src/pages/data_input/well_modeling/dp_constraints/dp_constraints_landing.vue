<template>
    <div>
        <DrainagePointConstraintInput
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
import DrainagePointConstraintInput from '../../../../components/drainage_point/input/constraints/constraints_input.vue'
import { findConstraintsInput } from "../../../../api_services/drainage_point_input";
import { constraintConditions , constraintUnits } from "../../../../constants/initial_assets";


const assetGroupsStore = useAssetGroupsStore();
const authStore = useAuthStore();
const propertyGridStore = usePropertyGridStore();
const assetsExplorerStore = useAssetsExplorerStore();

const { listItems } = storeToRefs(assetsExplorerStore);
const { activeDrainagePoint } = storeToRefs(assetGroupsStore);

export default {
  name: 'DrainagePointConstraintLanding',
  components:{
    DrainagePointConstraintInput,
  },
  emits: [],

  setup(props, { emit }) {
    const $q = useQuasar()

    const _activeDrainagePoint = ref({
        Constraints: constraintConditions.map((constraintCondition, idx) => {
            return {
                id: idx,
                abandonmentCondtion: constraintCondition,
                abandonmentValue: null,
                abandonmentUnit: constraintUnits[idx],
                constraintId: null
            }
        })
    });
    const selectedComponent = ref({});

    const updateEditableTable = (payload) => {

        _activeDrainagePoint.value[payload.variable] = payload.value;
        console.log("_activeDrainagePoint.value: ", _activeDrainagePoint.value);
    };

    const loadDrainagePointConstraintsInput = async () => {
        //debugger;
      //assetGroupId
      const  drainagePointId = selectedComponent.value.assetId;
      const  assetGroupId = selectedComponent.value.assetGroupId;

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

        updateEditableTable({
          value: constraints,
          variable: "Constraints"
        });
      
    }

     watch(activeDrainagePoint, async (newVal, oldVal) => {
        console.log('activeDrainagePoint changed from', oldVal, 'to', newVal);
        selectedComponent.value = {
            assetId: newVal.id,
            id: newVal.assetGroupName,
            assetGroupId: assetGroupsStore.selectedAssetGroup.id
        }
        console.log("selectedComponent: ", selectedComponent)
        await loadDrainagePointConstraintsInput();
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
        authStore.setStateData("pageTitle", "View Drainage Points Constraints"); 
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