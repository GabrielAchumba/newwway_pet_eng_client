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

const router = useRouter();
const propertyGridStore = usePropertyGridStore();

const tabData = reactive({
        'Production History': [
          { title: 'Production History', description: 'Enter production history', image: DailyOilProductionImage, route: "/" },
          { title: 'Well Test Data', description: 'Enter well test data', image: DailyOilProductionImage, route: "/" },
        ],
        Reservoir: [
          { title: 'BHP Data', description: 'Enter bottom hole pressure data', image: DailyOilProductionImage, route: "/" },
          { title: 'PVT Data', description: 'Enter reservoir fluid data', image: DailyOilProductionImage, route: "/" },
          { title: 'AVD Data', description: 'Enter area, volume, depth data', image: DailyOilProductionImage, route: "/" },
          { title: 'Aquifer Data', description: 'Enter aquifer properties values', image: DailyOilProductionImage, route: "/" },
          { title: 'SCAL', description: 'Enter Relative Permeability, Saturation and capillary pressure of the reservoir', image: DailyOilProductionImage, route: "/" },
          { title: 'Petrophysics Data', description: 'Enter the porosity, absolute permeability and net to gross of the reservoir', image: DailyOilProductionImage, route: "/" },
        ],
        Drilling: [
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
        'Well Completion': [
          { title: 'Down Hole Equipemnts', description: 'Enter down hole equipments', image: DailyOilProductionImage, route: "/" },
          { title: 'Sand Control', description: 'Enter the sand control equipment data', image: DailyOilProductionImage, route: "/" },
          { title: 'Geothermal Gradient', description: 'Enter the geothermal  data of the formation', image: DailyOilProductionImage, route: "/" },
          { title: 'View Completed Well Schematic', description: 'Enter mud and mud temperature and pressure data', image: DailyOilProductionImage, route: "/" },
        ],
        'Gathering Systems': [
          { title: 'Down Hole Equipemnts', description: 'Enter down hole equipments', image: DailyOilProductionImage, route: "/" },
          { title: 'Sand Control', description: 'Enter the sand control equipment data', image: DailyOilProductionImage, route: "/" },
          { title: 'Geothermal Gradient', description: 'Enter the geothermal  data of the formation', image: DailyOilProductionImage, route: "/" },
          { title: 'View Completed Well Schematic', description: 'Enter mud and mud temperature and pressure data', image: DailyOilProductionImage, route: "/" },
        ],
      })

const activeTab = ref('Reservoir')

const tabNames = computed(() => Object.keys(tabData))
const dataCards = computed(() => tabData[activeTab.value] || [])

function handleTabClick(tab) {
  activeTab.value = tab
}

function navigateTo(route) {
  if (route) router.push(route)
}

onMounted(() => {
  propertyGridStore.SetIsPropertyGridActivated(false);
});
</script>

<style lang="scss" scoped>
.card-custom {
  border-left: 4px solid $card-bar;
  height: 200px;
}
</style>