<template>
    <div>
        <p>Landing</p>
    </div>
</template>

<script>
import { storeToRefs } from 'pinia';
import { useAuthStore } from 'src/store/modules/authStore';
import { usePropertyGridStore } from 'src/store/modules/propertyGridStore';
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';
import { useAssetGroupsStore } from 'src/store/modules/assetGroupsStore';
import { findLiftCurvesNamesPerDrainagePoint, findOneLiftCurves } from 'src/api_services/well_modeling';

const authStore = useAuthStore();
const propertyGridStore = usePropertyGridStore();
const assetsExplorerStore = useAssetsExplorerStore();
const assetGroupsStore = useAssetGroupsStore();

const { listItems } = storeToRefs(assetsExplorerStore);

export default {
    name: 'WellLiftCurvesLanding2',
    data() {
        return {
            explorerListItems: listItems
        }
    },
    methods: {
        async getLiftCurvesNamesPerDrainagePoint(){

            const assetGroupId = assetGroupsStore.selectedAssetGroup.id;
            console.log("assetGroupId: ", assetGroupId);
            const drainagePointId = assetGroupsStore.activeDrainagePoint.id;
            console.log("drainagePointId: ", drainagePointId);

            const payload = {
                drainagePointId,
                assetGroupId,
            }
            const liftCurvesNames = await findLiftCurvesNamesPerDrainagePoint(payload);
            console.log("liftCurvesNames: ", liftCurvesNames);

        }
    },
    watch: {
        async explorerListItems(newVal, oldVal) {
            
            console.log('Message changed from', oldVal, 'to', newVal);
            await this.getLiftCurvesNamesPerDrainagePoint();
            
        }
    },
    async created() {
        var context = this;
        authStore.setStateData("showSpinner", false);
        authStore.setStateData("isError", false);
        authStore.setStateData("errorMessages", "");
        authStore.setStateData("pageTitle", "View Drainage Points Lift Curves"); 
        propertyGridStore.SetIsPropertyGridActivated(false);
        assetsExplorerStore.SetIsAssetsExplorerActivated(true);
    }
}
</script>