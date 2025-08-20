<template>
  <div class="map-variables-page q-pa-md">
    <q-table
      flat
      bordered
      :rows="rows"
      :columns="columns"
      row-key="id"
      hide-bottom
      class="map-table"
    >

      <template v-slot:top>
        <div class="q-pa-md worksheet-top">
          <ReadWorksheet
            v-for="qSelect in worksheetQSelects"
            :key="qSelect.label"
            :qSelect="qSelect"
            @onFileSelected="onFileSelected"
            @onQSelectItemValueChanged="onWorksheetChanged"
          />
        </div>
      </template>

      <!-- Custom Header -->
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

      <!-- Custom Body -->
      <template v-slot:body="props">
        <q-tr :props="props" class="custom-row">
          <!-- Application Column -->
          <q-td key="applicationColumn" :props="props">
            <NSelect
              :qSelect="props.row.applicationColumn"
              @onQSelectItemValueChanged="onApplicationColumnChanged"
              @onToggle="onToggle"
            />
          </q-td>

          <!-- Worksheet Column -->
          <q-td key="worksheetColumn" :props="props">
            <NSelect
              :qSelect="props.row.worksheetColumn"
              @onQSelectItemValueChanged="onWorksheetColumnChanged"
            />
          </q-td>

          <!-- Data Type -->
          <q-td key="dataType" :props="props">
            <NSelect
              :qSelect="props.row.dataType"
              @onQSelectItemValueChanged="onDataTypeChanged"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
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
    worksheetQSelects: { type: Array, default: () => [] }
  },
  computed: {
    rows() {
      return this.applicationColumns.map((applicationColumn, i) => ({
        id: applicationColumn.id || i,
        applicationColumn,
        worksheetColumn: this.worksheetColumns[i],
        dataType: this.dataTypes[i],
      }));
    },
    columns() {
      return [
        { name: "applicationColumn", label: "Application Column", field: "applicationColumn", align: "left" },
        { name: "worksheetColumn", label: "Worksheet Column", field: "worksheetColumn", align: "left" },
        { name: "dataType", label: "Data Type", field: "dataType", align: "left" },
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
    onToggle(event) {
      this.$emit("onToggle", event);
    },
    onFileSelected(payload) {
      this.$emit("onFileSelected", payload);
    },
    onWorksheetChanged(payload) {
      this.$emit("onWorksheetChanged", payload);
    }
  },
};
</script>

<style lang="scss" scoped>
.map-variables-page {
  background-color: $primary;
  max-width: 1100px;
  margin: 0 auto;
}

.map-table {
  background-color: $primary;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  height: 100vh; /* full screen height */
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* Sticky headers */
  .q-table__middle {
    flex: 1;
    overflow-y: auto;  /* vertical scroll */
    overflow-x: hidden;
  }

//   thead tr {
//     position: sticky;
//     top: 0;
//     z-index: 1;
//   }

  thead tr {
    position: sticky;
    top: 0;
    z-index: 3;
    background-color: $secondary;
    color: $primary;
  }
}

.custom-header {
  background-color: $secondary;
  color: $primary;
  font-weight: 600;
  font-size: 0.95rem;
}

.custom-row {
  background-color: $primary;
  &:hover {
    background-color: $selected-list-item;
    transition: background-color 0.2s ease;
  }
}

.q-td {
  padding: 10px;
  vertical-align: middle;
}

.worksheet-top {
    width: 100%;
  background: $card-bg;
  border-radius: 10px;
  margin-bottom: 12px;
  position: sticky; /* keep top slot visible as well */
  top: 0;
  z-index: 4; /* above header */
}
</style>