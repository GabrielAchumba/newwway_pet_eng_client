<template>
  <q-page class="q-pa-xl flex flex-center">
    <q-card class="q-pa-lg shadow-4" style="width: 90%; max-height: 70vh;">
      <q-card-section>
        <div class="text-h5 text-weight-bold q-mb-md">Well Datum</div>
        <q-form class="row q-col-gutter-md q-mb-lg">

          <q-select
            v-model="selectedDatum.datumName"
            :label="datumLabels.datumName"
            :options="datums"
            filled
            dense
            class="q-mb-md col-12 col-md-6"
            emit-value
            map-options
            :rules="[val => !!val || datumDescriptions.datumName]"
          />

          <q-input
            v-model="selectedDatum.typeOfShore"
            :label="datumLabels.typeOfShore"
            filled
            dense
            class="q-mb-md col-12 col-md-6"
            :rules="[val => !!val || datumDescriptions.typeOfShore]"
          />

          <q-input
            v-model="selectedDatum.datumName"
            :label="datumLabels.datumName"
            filled
            dense
            class="q-mb-md col-12 col-md-6"
            :rules="[val => !!val || datumDescriptions.datumName]"
          />

          <q-input
            v-model="selectedDatum.datumElevation"
            :label="datumLabels.datumElevation"
            filled
            dense
            class="q-mb-md col-12 col-md-6"
            :rules="[val => !!val || datumDescriptions.datumElevation]"
          />

          <q-input
            v-model="selectedDatum.groundElevation"
            :label="datumLabels.groundElevation"
            filled
            dense
            class="q-mb-md col-12 col-md-6"
            :rules="[val => !!val || datumDescriptions.groundElevation]"
          />

          <q-input
            v-model="selectedDatum.wellHeadElevation"
            :label="datumLabels.wellHeadElevation"
            filled
            dense
            class="q-mb-md col-12 col-md-6"
            :rules="[val => !!val || datumDescriptions.wellHeadElevation]"
          />

          <q-input
            v-model="selectedDatum.airGap"
            :label="datumLabels.wellHeadElevation"
            filled
            dense
            class="q-mb-md col-12 col-md-6"
            :rules="[val => !!val || datumDescriptions.airGap]"
          />
          

          <!-- Submit Button -->
          <q-btn
            label="Submit"
            type="click"
            color="primary"
            class="full-width q-mt-md"
            unelevated
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<!-- <script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  category: null,
})

const categories = [
  { label: 'Technology', value: 'tech' },
  { label: 'Finance', value: 'finance' },
  { label: 'Healthcare', value: 'health' },
]

const submitForm = () => {
  console.log('Form submitted:', form.value)
}
</script> -->

<script>
import textbox from "src/components/controls/texbox.vue"
//import textbox2 from "components/controls/textbox2.vue"
import comboBox from "src/components/controls/comboBox.vue";

import { useDatumStore } from 'src/store/modules/drilling/datumStore';
import { useAuthStore } from 'src/store/modules/drilling/authStore';
import { useWellDesignStore } from 'src/store/modules/drilling/wellDesignStore';
import { useDataImportStore } from 'src/store/modules/drilling/dataImportStore';

const datumStore = useDatumStore();
const authStore = useAuthStore();
const wellDesignStore = useWellDesignStore();
const dataImportStore = useDataImportStore();

export default {
  computed: {
    companyName(){
      return authStore.companyName;
    },
    SelectedTorqueDragDesign(){
      return wellDesignStore.SelectedTorqueDragDesign;
    },
    datums(){
      return datumStore.datums;
    },
    datumLabels(){
      return datumStore.datumLabels;
    },
    datumDescriptions(){
      return datumStore.datumDescriptions;
    }
  },
  components:{
    textbox,
    comboBox,
    //textbox2
  },
  data () {
    return {
      isUnit: true,
      isNotUnit: false,
      message: "",
      hasUnit1: true,
      hastUnit2: false,
      variableName: "Weight",
      variableUnit: "Ibf",
      text: '',
      datumList: [],
      showHideStyle: {
          display: 'inline'
      },
      expanded: false,
      typeOfShore: "",
      datumElevation: "",
      groundElevation: "",
      airGap: "",
      wellHeadElevation: "",
      datumName: "",
      visible: true,
      expanded2: true,
      selectedDatum: {
        typeOfShore: "",
        datumName: "",
        datumElevation: '',
        groundElevation: '',
        wellHeadElevation: '',
        airGap: ''
      }
    }
  },
  methods: {
    ExpandExander(){
      var context = this;
      context.expanded = true;
      context.expanded2 = false
    },
    ExpandExander2(){
      var context = this;
      if(context.expanded == true){
        context.expanded2 = false
      }else{
        context.expanded2 = true
      }
    },
    onDatumSelectionChanged(e){
      console.log("e: ", e)

      datumStore.onDatumSelectionChanged(e);
   
    },
    PostDatum(){
      var context = this;
      var selectedTorqueDragDesign = wellDesignStore.SelectedTorqueDragDesign;
      var IdentityModel = authStore.IdentityModel;
      var companyName = authStore.companyName;
      dataImportStore.SetLoaderParameters({
            showLoader: true,
            showImportView: false
          });

          console.log("context.datumElevation: ", context.datumElevation)
        const request = {
              typeOfShore: context.typeOfShore,
              datumElevation: parseFloat(context.datumElevation),
              groundElevation: parseFloat(context.groundElevation),
              airGap: parseFloat(context.airGap),
              wellHeadElevation: parseFloat(context.wellHeadElevation),
              datumName: context.datumName,
              companyName,
              designId: selectedTorqueDragDesign.id,
              userId: IdentityModel._id
          }

          console.log('request: ', request);
          datumStore.PostDatum(request);
          //this.$store.dispatch('datumStore/PostDatum', request);

          context.expanded = false;
          context.expanded2 = true
    },
    cancelDatum(){
      var context =  this;
      context.expanded = false;
      context.expanded2 = true
    }
      
  },
  created() {

      var tabCaption = "Datum Details";
      //this.$store.commit('settingsStore/GetTabCaption', tabCaption);
   }
  }
</script>

<style scoped>

.q-page {
  position: relative;
  min-height: 100vh;
  background-color: #f5f5f5; /* optional fallback color */
  overflow: hidden;
}

/* Background image using a pseudo-element */
.q-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('src/assets/images/drilling_eng_bg.jpg'); 
  background-size: cover; /* or cover or 200px auto etc. contain */
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.1; /* 👈 control how faded the watermark appears */
  pointer-events: none; /* ensures user interactions pass through */
  z-index: 0;
}

/* Ensure card content stays on top */
.q-card {
  position: relative;
  z-index: 1;
  border-radius: 16px;
}

</style>