<template>
    <q-page class="bg-forecolor1 q-pa-md scroll" style="scrollbar-width: none; height: 80vh;">
        <div>
            <q-tabs
            v-model="activeTab"
            class="bg-forecolor1 text-secondary q-mb-md"
            align="left"
            dense
            narrow-indicator
            active-color="secondary"
            indicator-color="secondary"
            no-caps
            >
            <q-tab
                v-for="tab in tabNames"
                :key="tab"
                :name="tab"
                :label="tab"
                @click="handleTabClick(tab)"
            />
            </q-tabs>

            

        </div>
    </q-page>
</template>

<script setup>


import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import DailyOilProductionImage from 'assets/images/Oil.svg';
import MonthlyProductionForecastImage from 'assets/images/QualityAssurance.svg';
import EmissionsImage from 'assets/images/StoredDeck.svg';
import { usePropertyGridStore } from 'src/store/modules/propertyGridStore';
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';

const router = useRouter();
const propertyGridStore = usePropertyGridStore();
const assetsExplorerStore = useAssetsExplorerStore();

const tabData = reactive([
        'IPR Layer',
        "Abandonment Constraints"
      ])

const activeTab = ref('Production Data')

const tabNames = computed(() => tabData)

function handleTabClick(tab) {
  activeTab.value = tab
}

function navigateTo(route) {
  if (route) {
    console.log(route)
    router.push(route)
  }
}

onMounted(() => {
  propertyGridStore.SetIsPropertyGridActivated(false);
  assetsExplorerStore.SetIsAssetsExplorerActivated(false);
});
</script>

<style lang="scss" scoped>
.card-custom {
  border-left: 4px solid $card-bar;
  height: 200px;
}
</style>