<template>
  <div class="map-variables-page q-pa-md">
    <div class="table-wrapper">
      <q-table
        flat
        bordered
        :rows="rows"
        :columns="columns"
        row-key="id"
        hide-bottom
        class="map-table"
        :rows-per-page-options="[0]"   
        style="max-height: calc(100vh - 150px);"  
        >
        <!-- TOP -->
        <template v-slot:top>
          <div class="q-pa-md worksheet-top" ref="worksheetTop">
            <ReadWorksheet
              v-for="qSelect in worksheetQSelects"
              :key="qSelect.label"
              :qSelect="qSelect"
              @onFileSelected="onFileSelected"
              @onQSelectItemValueChanged="onWorksheetChanged"
              @onExcelDataStartRowChanged="onExcelDataStartRowChanged"
            />
          </div>
        </template>

        <!-- HEADER -->
        <template v-slot:header="props">
          <q-tr :props="props" class="custom-header">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <!-- BODY -->
        <template v-slot:body="props">
          <q-tr :props="props" class="custom-row">
            <q-td key="applicationColumn" :props="props">
              <NSelect
                :qSelect="props.row.applicationColumn"
                @onQSelectItemValueChanged="onApplicationColumnChanged"
                @onToggle="onToggle"
              />
            </q-td>

            <q-td key="worksheetColumn" :props="props">
              <NSelect
                :qSelect="props.row.worksheetColumn"
                @onQSelectItemValueChanged="onWorksheetColumnChanged"
              />
            </q-td>

            <q-td key="dataType" :props="props">
              <NSelect
                :qSelect="props.row.dataType"
                @onQSelectItemValueChanged="onDataTypeChanged"
              />
            </q-td>

            <q-td key="dataUnit" :props="props">
              <NSelect
                :qSelect="props.row.dataUnit"
                @onQSelectItemValueChanged="onDataUnitChanged"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>


<script>
import NSelect from "../../drop_down/n-select.vue";
import ReadWorksheet from "./read-worksheet-new.vue";

export default {
  components: { NSelect, ReadWorksheet },
  props: {
    applicationColumns: { type: Array, default: () => [] },
    worksheetColumns: { type: Array, default: () => [] },
    dataTypes: { type: Array, default: () => [] },
    worksheetQSelects: { type: Array, default: () => [] },
    dataUnits: { type: Array, default: () => [] },
  },
  computed: {
    rows() {
        console.log("applicationColumns.length: ", this.applicationColumns.length)
      return this.applicationColumns.map((applicationColumn, i) => ({
        id: applicationColumn.id || i,
        applicationColumn,
        worksheetColumn: this.worksheetColumns[i],
        dataType: this.dataTypes[i],
        dataUnit: this.dataUnits[i],
      }));
    },
    columns() {
      return [
        { name: "applicationColumn", label: "Application Column", field: "applicationColumn", align: "left", headerClasses: 'bg-secondary text-white' },
        { name: "worksheetColumn", label: "Worksheet Column", field: "worksheetColumn", align: "left", headerClasses: 'bg-secondary text-white' },
        { 
          name: "dataType", 
          label: "Data Type", 
          field: "dataType", 
          align: "left", 
          headerClasses: 'bg-secondary text-white', 
          headerStyle: 'min-width: 200px; max-width: 300px;',
        },
        { 
          name: "dataUnit", 
          label: "Unit", 
          field: "dataUnit", 
          align: "left", 
          headerClasses: 'bg-secondary text-white', 
          headerStyle: 'min-width: 200px; max-width: 300px;',
        },
      ];
    },
  },
  methods: {
    onApplicationColumnChanged(_qSelect) {
      this.$emit("onApplicationColumnChanged", _qSelect);
    },
    onWorksheetColumnChanged(_qSelect) {
      this.$emit("onWorksheetColumnChanged", _qSelect);
    },
    onDataTypeChanged(_qSelect) {
      this.$emit("onDataTypeChanged", _qSelect);
    },
    onDataUnitChanged(_qSelect) {
      this.$emit("onDataUnitChanged", _qSelect);
    },
    onToggle(event) {
      this.$emit("onToggle", event);
    },
    onFileSelected(payload) {
      this.$emit("onFileSelected", payload);
    },
    onWorksheetChanged(payload) {
        console.log("payload: ", payload)
      this.$emit("onQSelectItemValueChanged", payload);
    },
    onExcelDataStartRowChanged(payload){
      this.$emit("onExcelDataStartRowChanged", payload);
    }
  },
  mounted() {
    const el = this.$refs.worksheetTop;
    if (el) {
        const updateHeight = () => {
        document.documentElement.style.setProperty(
            "--worksheet-top-height",
            `${el.offsetHeight}px`
        );
        };
        updateHeight();
        this.resizeObserver = new ResizeObserver(updateHeight);
        this.resizeObserver.observe(el);
    }
  },
  beforeUnmount() {
    if (this.resizeObserver) {
        this.resizeObserver.disconnect();
    }
  },
  created(){
    var context = this;
    console.log("context._applicationColumns: ", context.applicationColumns)
  }
};
</script>

<style lang="scss" scoped>
.map-variables-page {
  background-color: $primary;
  max-width: 1100px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.table-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* allows flex children to shrink */
  overflow: hidden; /* prevent double scroll */
}

.map-table {
  /* make the body scroll */
  max-height: calc(100vh - 150px);
  overflow-y: auto;
}

/* sticky table header */
:deep(.q-table thead tr th) {
  position: sticky;
  top: 0;
  background: white; /* or var(--q-table-bg) if you use Quasar’s CSS vars */
  z-index: 2;
}

.worksheet-top {
  width: 100%;
  background: $card-bg;
  border-radius: 10px;
  margin-bottom: 12px;
  position: sticky;
  top: 0;
  z-index: 3;
  flex-shrink: 0;

  /* stack items vertically */
  display: flex;
  flex-direction: column; 
  gap: 8px; /* spacing between children */
}

:deep(.worksheet-top > * ) {
  width: 100%;  /* make each ReadWorksheet stretch full width */
}


</style>