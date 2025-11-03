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
import MonthlyProductionForecastImage from 'assets/images/QualityAssurance.svg';
import EmissionsImage from 'assets/images/StoredDeck.svg';
import { usePropertyGridStore } from 'src/store/modules/propertyGridStore';
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';

const router = useRouter();
const propertyGridStore = usePropertyGridStore();
const assetsExplorerStore = useAssetsExplorerStore();

const tabData = reactive({
        'Production Data': [
          { title: 'Production History', description: 'Enter production history', image: DailyOilProductionImage, route: "/" },
          { title: 'Well Test Data', description: 'Enter well test data', image: DailyOilProductionImage, route: '/import-welltest-data' },
          { title: 'External Business Forecast Deck', description: 'Enter external business forecast deck', image: DailyOilProductionImage, route: '/import-welltest-data' },
          { title: 'Internally Generated Business Forecast Deck', description: 'Enter niernally generated business forecast deck', image: DailyOilProductionImage, route: '/import-welltest-data' },
          { title: 'Forecast Profile from MBAL', description: 'Enter forecast profile from MBAL', image: DailyOilProductionImage, route: '/import-welltest-data' },
          { title: 'Forecast Profile from ECLIPSE', description: 'Enter forecast profile from ECLIPSE', image: DailyOilProductionImage, route: '/import-welltest-data' },
          { title: 'Forecast Profile from GAP', description: 'Enter forecast profile from GAP', image: DailyOilProductionImage, route: '/import-welltest-data' },
        ],
        "Reservoir": [
          { title: 'BHP Data', description: 'Enter bottom hole pressure data', image: DailyOilProductionImage, route: "/" },
          { title: 'PVT Data', description: 'Enter reservoir fluid data', image: DailyOilProductionImage, route: "/" },
          { title: 'AVD Data', description: 'Enter area, volume, depth data', image: DailyOilProductionImage, route: "/" },
          { title: 'Aquifer Data', description: 'Enter aquifer properties values', image: DailyOilProductionImage, route: "/" },
          { title: 'SCAL', description: 'Enter Relative Permeability, Saturation and capillary pressure of the reservoir', image: DailyOilProductionImage, route: "/" },
          { title: 'Petrophysics Data', description: 'Enter the porosity, absolute permeability and net to gross of the reservoir', image: DailyOilProductionImage, route: "/" },
        ],
        "Drilling": [
          { title: 'Create a Welll', description: 'Create a well with a unique name', image: DailyOilProductionImage, route: "/" },
          { title: 'Well Datum', description: 'Create datum for a given well', image: DailyOilProductionImage, route: "/well-datum-input" },
          { title: 'Survey Data', description: 'Create well deviation survey data', image: DailyOilProductionImage, route: "/" },
          { title: 'Hole Sections', description: 'Enter hole sections data for a given well', image: DailyOilProductionImage, route: "/" },
          { title: 'Drill Pipes & Bits', description: 'Enter drill pipes data for a given well', image: DailyOilProductionImage, route: "/" },
          { title: 'Drill Fluid', description: 'Enter drill fluid properties', image: DailyOilProductionImage, route: "/" },
          { title: 'Rig', description: 'Enter rig data', image: DailyOilProductionImage, route: "/" },
          { title: 'Operations', description: 'Enter drill operations data', image: DailyOilProductionImage, route: "/" },
          { title: 'Subsurface', description: 'Enter subsurface data', image: DailyOilProductionImage, route: "/" },
        ],
        'Drainage Point': [
          { title: 'Configure', description: 'Initialize dranaige-point data', image: DailyOilProductionImage, route: '/drainage-point-config-landing' },
          { title: 'DCA Model', description: 'Enter decline curve analysis input data', image: DailyOilProductionImage, route: '/drainage-point-dca-input-landing' },
          { title: 'IPR Model', description: 'Enter inflow performance relationship input data', image: DailyOilProductionImage, route: "/" },
          { title: 'Lift Curves', description: 'View or import lift curves', image: DailyOilProductionImage, route: '/well-lift-curves-landing' },
          { title: 'Constraints', description: 'Enter drainage-point constraint values', image: DailyOilProductionImage, route: '/drainage-point-constraints-landing' },
          { title: 'Schedule', description: 'Enter time dependent constraints and other schedules', image: DailyOilProductionImage, route: "/" },
        ],
        'Surface Systems Data': [
          { title: 'Equipments Capacities', description: 'Enter equipments capacities', image: DailyOilProductionImage, route: "/" },
          { title: 'Deferments', description: 'Enter facilities deferments', image: DailyOilProductionImage, route: "/" },
          { title: 'Own Use Gas', description: 'Enter facilities own use gas', image: DailyOilProductionImage, route: "/" },
          { title: 'Flared Gas', description: 'Enter facilities flared gas', image: DailyOilProductionImage, route: "/" },
          { title: 'Crude Oil Losses', description: 'Enter facilities crude oil losses', image: DailyOilProductionImage, route: "/" },
        ],
      })

const activeTab = ref('Production Data')

const tabNames = computed(() => Object.keys(tabData))
const dataCards = computed(() => tabData[activeTab.value] || [])

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