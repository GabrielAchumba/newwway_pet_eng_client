<template>
    <div>
        <p>Landing</p>
    </div>
</template>

<script>
import { useAuthStore } from 'src/store/modules/authStore';
import { usePropertyGridStore } from 'src/store/modules/propertyGridStore';
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';

const authStore = useAuthStore();
const propertyGridStore = usePropertyGridStore();
const assetsExplorerStore = useAssetsExplorerStore();

export default {
    name: 'WellLiftCurvesLanding',
    data() {
        return {

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