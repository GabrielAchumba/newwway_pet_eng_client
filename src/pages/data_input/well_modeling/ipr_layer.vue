<template>
  <q-page class="q-pa-md" style="background-color: #FFFFFF;">
    <div class="column q-gutter-y-md">
      <!-- Inflow Performance Section -->
      <q-card class="q-pa-md">
        <div class="row items-center q-pb-md">
          <div class="card-bar q-mr-md"></div>
          <div class="text-h6" style="color: #475569;">Inflow Performance</div>
        </div>
        
        <div class="row q-col-gutter-md">
          <!-- Column 1 -->
          <div class="col-12 col-md-6">
            <!-- Layer Type -->
            <div class="q-mb-md">
              <div class="text-caption q-mb-xs" style="color: #475569;">Layer Type</div>
              <q-select
                v-model="inflowPerformance.layerType"
                :options="layerTypeOptions"
                outlined
                dense
                bg-color="#F0F4F8"
                color="#0A1D3F"
              />
            </div>

            <!-- Darcy -->
            <div class="q-mb-md">
              <div class="text-caption q-mb-xs" style="color: #475569;">Darcy</div>
              <q-input
                v-model="inflowPerformance.darcy"
                outlined
                dense
                bg-color="#F0F4F8"
                color="#0A1D3F"
              />
            </div>

            <!-- Layer Pressure -->
            <div class="q-mb-md">
              <div class="text-caption q-mb-xs" style="color: #475569;">Layer Pressure</div>
              <q-input
                v-model="inflowPerformance.layerPressure"
                outlined
                dense
                bg-color="#F0F4F8"
                color="#0A1D3F"
              />
            </div>

            <!-- Permeability Compaction Correlation -->
            <div class="q-mb-md">
              <div class="text-caption q-mb-xs" style="color: #475569;">Permeability Compaction Correlation</div>
              <q-input
                v-model="inflowPerformance.permeabilityCompaction"
                outlined
                dense
                bg-color="#F0F4F8"
                color="#0A1D3F"
              />
            </div>
          </div>

          <!-- Column 2 -->
          <div class="col-12 col-md-6">
            <!-- IPR Type -->
            <div class="q-mb-md">
              <div class="text-caption q-mb-xs" style="color: #475569;">IPR Type</div>
              <q-input
                v-model="inflowPerformance.iprType"
                outlined
                dense
                bg-color="#F0F4F8"
                color="#0A1D3F"
              />
            </div>

            <!-- Non Darcy -->
            <div class="q-mb-md">
              <div class="text-caption q-mb-xs" style="color: #475569;">Non Darcy</div>
              <q-input
                v-model="inflowPerformance.nonDarcy"
                outlined
                dense
                bg-color="#F0F4F8"
                color="#0A1D3F"
              />
            </div>

            <!-- Layer Temperature -->
            <div class="q-mb-md">
              <div class="text-caption q-mb-xs" style="color: #475569;">Layer Temperature</div>
              <q-input
                v-model="inflowPerformance.layerTemperature"
                outlined
                dense
                bg-color="#F0F4F8"
                color="#0A1D3F"
              />
            </div>

            <!-- Crossflow Injectivity Index -->
            <div class="q-mb-md">
              <div class="text-caption q-mb-xs" style="color: #475569;">Crossflow Injectivity Index</div>
              <q-input
                v-model="inflowPerformance.crossflowInjectivity"
                outlined
                dense
                bg-color="#F0F4F8"
                color="#0A1D3F"
              />
            </div>
          </div>
        </div>
      </q-card>

      <!-- Fluid Properties Section -->
      <q-card class="q-pa-md">
        <div class="row items-center q-pb-md">
          <div class="card-bar q-mr-md"></div>
          <div class="text-h6" style="color: #475569;">Fluid Properties</div>
        </div>
        
        <div class="row q-col-gutter-md">
          <!-- Column 1 -->
          <div class="col-12 col-md-6">
            <!-- Oil Gravity -->
            <div class="q-mb-md">
              <div class="text-caption q-mb-xs" style="color: #475569;">Oil gravity</div>
              <q-input
                v-model="fluidProperties.oilGravity"
                outlined
                dense
                bg-color="#F0F4F8"
                color="#0A1D3F"
              />
            </div>

            <!-- GOR -->
            <div class="q-mb-md">
              <div class="text-caption q-mb-xs" style="color: #475569;">GOR</div>
              <q-input
                v-model="fluidProperties.gor"
                outlined
                dense
                bg-color="#F0F4F8"
                color="#0A1D3F"
              />
            </div>

            <!-- H2S -->
            <div class="q-mb-md">
              <div class="text-caption q-mb-xs" style="color: #475569;">H2S</div>
              <q-input
                v-model="fluidProperties.h2s"
                outlined
                dense
                bg-color="#F0F4F8"
                color="#0A1D3F"
              />
            </div>

            <!-- N2 -->
            <div class="q-mb-md">
              <div class="text-caption q-mb-xs" style="color: #475569;">N2</div>
              <q-input
                v-model="fluidProperties.n2"
                outlined
                dense
                bg-color="#F0F4F8"
                color="#0A1D3F"
              />
            </div>
          </div>

          <!-- Column 2 -->
          <div class="col-12 col-md-6">
            <!-- Gas Gravity -->
            <div class="q-mb-md">
              <div class="text-caption q-mb-xs" style="color: #475569;">Gas gravity</div>
              <q-input
                v-model="fluidProperties.gasGravity"
                outlined
                dense
                bg-color="#F0F4F8"
                color="#0A1D3F"
              />
            </div>

            <!-- WGR -->
            <div class="q-mb-md">
              <div class="text-caption q-mb-xs" style="color: #475569;">WGR</div>
              <q-input
                v-model="fluidProperties.wgr"
                outlined
                dense
                bg-color="#F0F4F8"
                color="#0A1D3F"
              />
            </div>

            <!-- Water Salinity Pressure -->
            <div class="q-mb-md">
              <div class="text-caption q-mb-xs" style="color: #475569;">Water salinity Pressure</div>
              <q-input
                v-model="fluidProperties.waterSalinity"
                outlined
                dense
                bg-color="#F0F4F8"
                color="#0A1D3F"
              />
            </div>

            <!-- CO2 -->
            <div class="q-mb-md">
              <div class="text-caption q-mb-xs" style="color: #475569;">CO2</div>
              <q-input
                v-model="fluidProperties.co2"
                outlined
                dense
                bg-color="#F0F4F8"
                color="#0A1D3F"
              />
            </div>
          </div>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'IPRLayer',
  data() {
    return {
      layerTypeOptions: ['Oil', 'Gas', 'Ret. Condensate'],
      inflowPerformance: {
        layerType: 'Oil',
        iprType: '',
        darcy: '',
        nonDarcy: '',
        layerPressure: '',
        layerTemperature: '',
        permeabilityCompaction: '',
        crossflowInjectivity: ''
      },
      fluidProperties: {
        oilGravity: '',
        gasGravity: '',
        gor: '',
        wgr: '',
        waterSalinity: '',
        h2s: '',
        co2: '',
        n2: ''
      }
    }
  }
}
</script>

<style scoped>
.card-bar {
  width: 4px;
  height: 24px;
  background-color: #E2372D;
  border-radius: 2px;
}

.q-card {
  background-color: #F0F4F8;
  border-radius: 8px;
}

.text-caption {
  font-weight: 500;
}
</style>