<template>
  <div id="datumpage" class="q-pa-md">

    <!-- Add Datum Button -->
    <div class="row q-mb-md justify-end">
      <q-btn 
        icon="add_box"
        size="sm"
        flat
        color="accent"
        @click="ExpandExander"
      >
        <q-tooltip>Add Datum</q-tooltip>
      </q-btn>
    </div>

    <!-- Expanded Form for New Datum -->
    <q-card v-if="expanded" class="q-pa-md q-mb-lg shadow-2">
      <q-card-section class="q-gutter-y-md">

        <textbox variableName="Type of Shore" col1="4" col2="8"
          v-model="typeOfShore"
          :hasUnit="false"
          :toolTipDescription="datumDescriptions.typeOfShore"
        />

        <textbox variableName="Datum Name" col1="4" col2="8"
          v-model="datumName"
          :hasUnit="false"
          :toolTipDescription="datumDescriptions.datumName"
        />

        <textbox variableName="Datum Elevation" col1="4" col2="8"
          v-model="datumElevation"
          unit="ft" :hasUnit="true"
          :toolTipDescription="datumDescriptions.datumElevation"
        />

        <textbox variableName="Ground Elevation" col1="4" col2="8"
          v-model="groundElevation"
          unit="ft" :hasUnit="true"
          :toolTipDescription="datumDescriptions.groundElevation"
        />

        <textbox variableName="WellHead Elevation" col1="4" col2="8"
          v-model="wellHeadElevation"
          unit="ft" :hasUnit="true"
          :toolTipDescription="datumDescriptions.wellHeadElevation"
        />

        <textbox variableName="Air Gap" col1="4" col2="8"
          v-model="airGap"
          unit="ft" :hasUnit="true"
          :toolTipDescription="datumDescriptions.airGap"
        />

        <!-- Action Buttons -->
        <div class="row justify-end q-gutter-sm q-mt-md">
          <q-btn
            flat
            label="Cancel"
            color="primary"
            @click="cancelDatum"
          />
          <q-btn
            unelevated
            color="accent"
            label="Add"
            @click="PostDatum"
          />
        </div>

      </q-card-section>
    </q-card>

    <!-- Existing Datum Display -->
    <q-card v-if="expanded2" class="q-pa-md shadow-1">
      <q-card-section class="q-gutter-y-md">

        <comboBox
          v-on:onSelectionChanged="onDatumSelectionChanged($event)"
          variableName="Select Datum:"
          col1="4" col2="8"
          :listOfData="datums"
          :toolTipDescription="datumDescriptions.datumName"
        />

        <textbox disabled variableName="Shore" col1="4" col2="8"
          :variable="selectedDatum.typeOfShore"
          :hasUnit="false"
          :toolTipDescription="datumDescriptions.typeOfShore"
        />

        <textbox disabled variableName="Datum Name" col1="4" col2="8"
          :variable="selectedDatum.datumName"
          :hasUnit="false"
          :toolTipDescription="datumDescriptions.datumName"
        />

        <textbox disabled variableName="Datum Elevation" col1="4" col2="8"
          :variable="selectedDatum.datumElevation"
          unit="ft" :hasUnit="true"
          :toolTipDescription="datumDescriptions.datumElevation"
        />

        <textbox disabled variableName="Ground Elevation" col1="4" col2="8"
          :variable="selectedDatum.groundElevation"
          unit="ft" :hasUnit="true"
          :toolTipDescription="datumDescriptions.groundElevation"
        />

        <textbox disabled variableName="WellHead Elevation" col1="4" col2="8"
          :variable="selectedDatum.wellHeadElevation"
          unit="ft" :hasUnit="true"
          :toolTipDescription="datumDescriptions.wellHeadElevation"
        />

        <textbox disabled variableName="Air Gap" col1="4" col2="8"
          :variable="selectedDatum.airGap"
          unit="ft" :hasUnit="true"
          :toolTipDescription="datumDescriptions.airGap"
        />

      </q-card-section>
    </q-card>

  </div>
</template>

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
    selectedDatum(){
      return datumStore.selectedDatum;
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
      expanded2: true
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

#datumpage {
    text-align: left;
    font-family: Segoe UI;
    font-style: normal;
    font-weight: lighter;
    font-size: 15px;
    /* color: rgba(214,214,214,1); */
    background-color: var(--q-primary);
}

.disabledTag {
    pointer-events: none;
    opacity: 0.4;
}

</style>