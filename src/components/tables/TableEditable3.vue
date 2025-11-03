<template>
  <div class="report-page">
    <q-card class="report-card">
      <q-table
        dense
        flat
        :rows="rows"
        :columns="columns"
        row-key="id"
        hide-bottom
        :pagination="{ rowsPerPage: 0 }"
        class="report-table"
        >

            <template v-slot:header="props">
                <q-tr :props="props">
                <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                    class="bg-secondary text-primary"
                >
                    {{ col.label }}
                </q-th>
                </q-tr>
            </template>

            <template v-slot:body="props">
                <q-tr>

                    <q-td 
                        class="bg-primary"
                        v-for="column in columns" :key="column.name"
                        :props="props">

                        <q-input
                        v-if="column?.variableType === 'text' && column?.isEditable === true"
                        dense
                        outlined
                        :model-value="rows[props.row.id][column.name]"
                        @update:model-value="updateProperty(props.row, column, $event)"
                        />

                        <q-input
                        v-else-if="column?.variableType === 'number' && column?.isEditable === true"
                        dense
                        outlined
                        type="number"
                        :model-value="rows[props.row.id][column.name]"
                        @update:model-value="updateProperty(props.row, column, $event)"
                        />

                        <q-select
                        v-else-if="column?.variableType === 'select' && column?.isEditable === true"
                        dense
                        outlined
                        option-disable="inactive"
                        :options="column?.options"
                        :model-value="rows[props.row.id][column.name]"
                        option-value="id"
                        option-label="type"
                        name="type"
                        emit-value
                        map-options
                        @update:model-value="updateProperty(props.row, column, $event)"
                        />

                        <q-toggle
                        v-else-if="column?.variableType === 'boolean' && column?.isEditable === true"
                        :model-value="rows[props.row.id][column.name]"
                        color="secondary"
                        @update:model-value="updateProperty(props.row, column, $event)"
                        />

                        <q-input
                        v-else-if="column?.variableType === 'color' && column?.isEditable === true"
                        dense
                        outlined
                        :model-value="rows[props.row.id][column.name]"
                        readonly
                        >
                        <template v-slot:append>
                            <q-icon
                            name="palette"
                            :style="{ color: rows[props.row.id][column.name] }"
                            class="cursor-pointer"
                            @click="pickColor(props.row, column)"
                            />
                        </template>
                        </q-input>

                        <q-input
                        v-else-if="column?.variableType === 'date' && column?.isEditable === true"
                        dense
                        outlined
                        :model-value="rows[props.row.id][column.name]"
                        mask="####-##-##"
                        readonly
                        >
                        <template v-slot:append>
                            <q-icon
                            name="event"
                            class="cursor-pointer"
                            @click="pickDate(props.row, column)"
                            />
                        </template>
                        </q-input>

                        
                        <span v-else>{{props.row[column.name] }}</span>
                    </q-td>
                </q-tr>
            </template>

        </q-table>
    </q-card>

    <!-- Color Picker Dialog -->
    <q-dialog v-model="colorDialog.visible">
      <q-card>
        <q-card-section>
          <div class="text-h6">Pick a Color</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-color
            v-model="colorDialog.tempValue"
            format-model="hex"
            no-header
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" label="OK" @click="confirmColor" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Date Picker Dialog -->
    <q-dialog v-model="dateDialog.visible">
      <q-card>
        <q-card-section class="text-h6 bg-secondary text-primary">
          <div class="text-h6">Pick a Date</div>
        </q-card-section>
        <q-separator />
        <q-date v-model="dateDialog.tempValue" mask="YYYY-MM-DD" />
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Cancel" class="bg-accent text-primary" v-close-popup />
          <q-btn class="bg-secondary text-primary" label="OK" @click="confirmDate" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</div>
</template>

<script>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'

export default {
  name: 'TableEditable2',

  props: {
    columns:{
        type: Array,
        default: () => ([]),
    },
    rows:{
        type: Array,
        default: () => ([]),
    }
  },
  emits: ['updateEditableTable'],
  setup(props, { emit }) {
    const $q = useQuasar()

    const colorDialog = ref({
            visible: false,
            row: null,
            column: null,
            tempValue: ''
        });
    const dateDialog = ref({
            visible: false,
            row: null,
            column: null,
            tempValue: ''
        });

    const rows = ref(props.rows);
    const columns = ref(props.columns);


    const updateProperty = (row, column, value) => {
        console.log("value: ", value)

        rows.value[row.id][column.name] = value;

        emit('updateEditableTable', {
            value: rows.value
        });
    }

    const pickColor = (row, column) => {
        colorDialog.value.visible = true
        colorDialog.value.row = row
        colorDialog.value.column = rcolumnow
        colorDialog.value.tempValue = prop.value
    }

    const pickDate = (row, column) => {

        console.log('row: ', row)
        console.log('column: ', column)

        dateDialog.value.visible = true
        dateDialog.value.row = row
        dateDialog.value.column = column
        dateDialog.value.tempValue = row
    }

    const confirmColor = () => {
        updateProperty(colorDialog.value.row, colorDialog.value.column, colorDialog.value.tempValue)
        colorDialog.value.visible = false
    }

    const confirmDate = () => {
        updateProperty(dateDialog.value.row, dateDialog.value.column, dateDialog.value.tempValue)
        dateDialog.value.visible = false
    }

    watch(() => props.rows, (newVal) => {
      console.log("props.rows changed:", newVal)

      rows.value = [...newVal];
      
    }, { deep: true, immediate: true })

    return {
        rows,
        columns,
        colorDialog,
        dateDialog,
        updateProperty,
        pickColor,
        pickDate,
        confirmColor,
        confirmDate
    };
  }
}
</script>

<style lang="scss">
.report-page {
  background-color: $primary;
  height: 100vh;
  padding: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .report-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: $primary;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    .report-table {
      flex: 1;
      display: flex;
      flex-direction: column;
      border-collapse: collapse;

      .q-table__top,
      .q-table__bottom {
        background-color: $primary;
      }

      .q-table__container {
        flex: 1;
        display: flex;
        flex-direction: column;
        background-color: $primary;
        border: 1px solid rgba(0, 0, 0, 0.12);
      }

      .q-table__middle {
        flex: 1;
        overflow-y: auto;
        max-height: calc(100vh - 120px);
        
        &::-webkit-scrollbar {
          width: 8px;
        }
        
        &::-webkit-scrollbar-thumb {
          background-color: rgba($secondary, 0.2);
          border-radius: 4px;
        }
      }

      .q-table__grid-content {
        overflow-y: auto;
      }

      .q-table thead tr {
        position: sticky;
        top: 0;
        z-index: 1;
        background-color: $secondary;
        color: $primary;
      }

      .q-table tbody tr {
        background-color: $primary;
      }

      .q-table th, .q-table td {
        border-right: 1px solid rgba(0, 0, 0, 0.12);
        &:last-child {
          border-right: none;
        }
      }

      .q-table th {
        font-weight: 600;
        font-size: 14px;
        color: $primary;
        border-bottom: 2px solid rgba(0, 0, 0, 0.12);
      }

      .q-table td {
        font-size: 13px;
        color: $forecolor1;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      }
    }
  }
}
</style>