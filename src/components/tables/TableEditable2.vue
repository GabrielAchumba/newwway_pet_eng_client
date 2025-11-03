<template>
  <div class="report-page">
    <q-card class="report-card">
      <q-table
        dense
        flat
        :rows="table_VM.rows"
        :columns="table_VM.columns"
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

        <template v-slot:body-cell-value="props">
            <!-- Text -->
            <q-input
            v-if="props.row.type === 'text'"
            dense
            outlined
            :model-value="props.row.value"
            @blur="updateProperty(props.row)"
            />

            <!-- Number -->
            <q-input
            v-else-if="props.row.type === 'number'"
            dense
            outlined
            type="number"
            :model-value="props.row.value"
            @blur="updateProperty(props.row)"
            />

            <!-- Select -->
            <q-select
            v-else-if="props.row.type === 'select'"
            dense
            outlined
            :options="props.row.options"
            :model-value="props.row.value"
            @update:model-value="updateProperty(props.row)"
            />

            <!-- Toggle -->
            <q-toggle
            v-else-if="props.row.type === 'boolean'"
            :model-value="props.row.value"
            color="secondary"
            @update:model-value="updateProperty(props.row)"
            />

            <!-- Color Picker -->
            <q-input
            v-else-if="props.row.type === 'color'"
            dense
            outlined
            :model-value="props.row.value"
            readonly
            >
            <template v-slot:append>
                <q-icon
                name="palette"
                :style="{ color: props.row.value }"
                class="cursor-pointer"
                @click="pickColor(props.row)"
                />
            </template>
            </q-input>

            <!-- Date Picker -->
            <q-input
            v-else-if="props.row.type === 'date'"
            dense
            outlined
            :model-value="props.row.value"
            mask="####-##-##"
            readonly
            >
            <template v-slot:append>
                <q-icon
                name="event"
                class="cursor-pointer"
                @click="pickDate(props.row)"
                />
            </template>
            </q-input>

            <!-- Default -->
            <span v-else>{{ props.row.value }}</span>
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
        <q-card-section>
          <div class="text-h6">Pick a Date</div>
        </q-card-section>
        <q-separator />
        <q-date v-model="dateDialog.tempValue" mask="YYYY-MM-DD" />
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" label="OK" @click="confirmDate" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</div>
</template>

<script>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

export default {
  name: 'TableEditable2',

  props: {
    table_VM:{
        type: Object,
        default: () => ({}),
    }
  },
  emits: [],
  setup(props, { emit }) {
    const $q = useQuasar()
    console.log("props.table_VM: ", props.table_VM);

    const colorDialog = ref({
            visible: false,
            prop: null,
            tempValue: ''
        });
    const dateDialog = ref({
            visible: false,
            prop: null,
            tempValue: ''
        });

    const table_VM = ref(props.table_VM);


    const updateProperty = (row) => {
        console.log('row: ', row)
    }

    const pickColor = (prop) => {
        colorDialog.value.visible = true
        colorDialog.value.prop = prop
        colorDialog.value.tempValue = prop.value
    }

    const pickDate = (prop) => {
        dateDialog.value.visible = true
        dateDialog.value.prop = prop
        dateDialog.value.tempValue = prop.value
    }

    const confirmColor = () => {
        colorDialog.value.prop.value = colorDialog.value.tempValue
        updateProperty(colorDialog.value.prop)
        colorDialog.value.visible = false
    }

    const confirmDate = () => {
        dateDialog.value.prop.value = dateDialog.value.tempValue
        updateProperty(dateDialog.value.prop)
        dateDialog.value.visible = false
    }

    return {
        table_VM,
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