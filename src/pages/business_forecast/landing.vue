<template>
    <q-page class="bg-forecolor1 q-pa-md scroll" style="scrollbar-width: none; height: 80vh;">
        <div>
            <div class="q-pa-xl flex flex-center" style="height: 90vh;">
                <div class="row q-col-gutter-md q-mb-lg justify-center">
                    <div v-for="(card, index) in dataCards" :key="index" class="q-pa-sm" style="width: 360px;">
                        <q-card 
                        class="card-custom row items-center q-pa-md shadow-2 bordered" 
                        clickable 
                        v-ripple 
                        @click="navigateTo(card.route)">
                            <q-img :src="card.image" contain style="height: 48px; width: 48px" />
                            <div>
                                <div class="text-h6 text-secondary">{{ card.title }}</div>
                                <div class="text-caption text-forecolor1">{{ card.description }}</div>
                            </div>
                        </q-card>
                    </div>
                </div>
            </div>

        </div>
    </q-page>
</template>

<script setup>


import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import DailyOilProductionImage from 'assets/images/Oil.svg';
import { usePropertyGridStore } from 'src/store/modules/propertyGridStore';
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';

const router = useRouter();
const propertyGridStore = usePropertyGridStore();
const assetsExplorerStore = useAssetsExplorerStore();

const dataCards = reactive([
          { title: 'Run Forecast', description: 'Set up forecast parameters and run forecast', image: DailyOilProductionImage, route: '/run-business-forecast-parameters' },
          { title: 'Forecast Results Reporting', description: 'View and export stored forecast results', image: DailyOilProductionImage, route: "b" },
          { title: 'Forecast Results Vizualization', description: 'Chart plotting of stored forecast results', image: DailyOilProductionImage, route: 'b' },
        ]);


function navigateTo(route) {
  if (route) {

    const assetExplorerTitle = dataCards.find(row => row.route == route);
    console.log("assetExplorerTitle: ", assetExplorerTitle.title)
    assetsExplorerStore.setStateData("assetExplorerTitle", assetExplorerTitle.title); 

    router.push(route)
  }
}

onMounted(() => {
  propertyGridStore.SetIsPropertyGridActivated(false);
  assetsExplorerStore.SetIsAssetsExplorerActivated(false);
  assetsExplorerStore.setIsAssetCategorySelector(false)
});
</script>

<style lang="scss" scoped>
.card-custom {
  border-left: 4px solid $card-bar;
  height: 200px;
}
</style>