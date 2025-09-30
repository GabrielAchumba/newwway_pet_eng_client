<template>
  <q-card class="sensitivity-table-card" :class="cardClass">
    <q-card-section>
      <div class="text-h6 text-weight-bold" :class="titleClass">
        Sensitivity Variables
      </div>
    </q-card-section>

    <q-card-section>
      <q-table
        :rows="sensitivityData"
        :columns="columns"
        row-key="sn"
        flat
        bordered
        :card-class="tableCardClass"
        :class="tableTextClass"
        hide-bottom
        hide-pagination
      >
        <template #body="props">
          <q-tr :props="props" :class="tableRowClass">
            <q-td key="sn" :props="props">
              <span :class="textColorClass">
                {{ props.row.sn }}
              </span>
            </q-td>
            
            <q-td key="variable" :props="props">
              <span :class="textColorClass">
                {{ props.row.variable }}
              </span>
            </q-td>
            
            <q-td key="value" :props="props">
              <q-select
                v-model="props.row.value"
                :options="dropdownOptions"
                dense
                outlined
                emit-value
                map-options
                @update:model-value="(val) => handleValueChange(props.row.sn, val)"
                :bg-color="selectBgColor"
                :color="accentColor"
                dropdown-icon="arrow_drop_down"
                class="sensitivity-select"
              >
                <template #selected>
                  <span :class="textColorClass">
                    {{ props.row.value }}
                  </span>
                </template>
                
                <template #option="scope">
                  <q-item
                    v-bind="scope.itemProps"
                    :class="scope.selected ? 'selected-option' : 'normal-option'"
                  >
                    <q-item-section>
                      <q-item-label :class="textColorClass">
                        {{ scope.opt }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useQuasar } from 'quasar'

export default {
  name: 'SensitivityVariablesTable',
  
  emits: ['value-changed'],
  
  setup(props, { emit }) {
    const $q = useQuasar()
    
    const isDark = computed(() => $q.dark.isActive)

    // Computed properties for dynamic classes and colors
    const cardClass = computed(() => isDark.value ? 'bg-dark-page' : 'bg-primary')
    const titleClass = computed(() => isDark.value ? 'text-white' : 'text-secondary')
    const tableCardClass = computed(() => isDark.value ? 'bg-dark' : 'bg-primary')
    const tableTextClass = computed(() => isDark.value ? 'text-white' : 'text-dark')
    const tableRowClass = computed(() => isDark.value ? 'bg-dark' : 'bg-primary')
    const textColorClass = computed(() => isDark.value ? 'text-white' : 'text-forecolor1')
    const selectBgColor = computed(() => isDark.value ? 'dark' : 'card-bg')
    const accentColor = computed(() => 'accent')

    const columns = [
      {
        name: 'sn',
        required: true,
        label: 'SN',
        align: 'left',
        field: 'sn',
        sortable: true,
        style: 'width: 80px;'
      },
      {
        name: 'variable',
        required: true,
        label: 'Variable',
        align: 'left',
        field: 'variable',
        sortable: true
      },
      {
        name: 'value',
        required: true,
        label: 'Value',
        align: 'left',
        field: 'value',
        sortable: true
      }
    ]

    const dropdownOptions = ref([
        'Water Cut', 
        'Water Oil Ratio', 
        'Gas Oil Ratio', 
        'Condensate Rate Ratio', 
        'GLR Free',
        'Free Gas Rate',
        'GOR Free',
        'Total GOR',
        'Dissolved and Free GLR',
        'First Node Pressure',
        'Tubing Roughness',
        'Downhole Heat Transfer Coefficient'
    ])

    const sensitivityData = reactive([
      {
        sn: 1,
        variable: 'Sensitivity Variable 1',
        value: 'Water Cut'
      },
      {
        sn: 2,
        variable: 'Sensitivity Variable 2',
        value: 'Gas Oil Ratio'
      },
      {
        sn: 3,
        variable: 'Sensitivity Variable 3',
        value: 'First Node Pressure'
      }
    ])

    const handleValueChange = (sn, newValue) => {
      // Find the row that was changed
      const changedRow = sensitivityData.find(row => row.sn === sn)
      const oldValue = changedRow.value
      
      // Update the value in the data
      changedRow.value = newValue
      
      // Emit the change event with relevant data
      emit('value-changed', {
        sn: sn,
        variable: changedRow.variable,
        oldValue: oldValue,
        newValue: newValue,
        timestamp: new Date().toISOString()
      })
      
      console.log(`Value changed for SN ${sn}:`, {
        variable: changedRow.variable,
        oldValue: oldValue,
        newValue: newValue
      })
    }

    return {
      columns,
      sensitivityData,
      dropdownOptions,
      handleValueChange,
      cardClass,
      titleClass,
      tableCardClass,
      tableTextClass,
      tableRowClass,
      textColorClass,
      selectBgColor,
      accentColor,
      isDark
    }
  }
}
</script>

<style scoped>
.sensitivity-table-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.q-table__top) {
  background-color: transparent;
}

:deep(.q-table thead tr) {
  background-color: #F0F4F8; /* $card-bg for light mode */
}

:deep(.q-table th) {
  font-weight: bold;
  color: #0A1D3F; /* $secondary for light mode */
  background-color: #F0F4F8; /* $card-bg for light mode */
}

/* Dark mode styles */
:deep(.body--dark .q-table thead tr) {
  background-color: #0A1D3F; /* $secondary for dark mode */
}

:deep(.body--dark .q-table th) {
  color: white; /* $forecolor2 for dark mode */
  background-color: #0A1D3F; /* $secondary for dark mode */
}

:deep(.q-table tbody td) {
  border-bottom: 1px solid #e0e0e0;
}

:deep(.body--dark .q-table tbody td) {
  border-bottom: 1px solid #1D1D1D; /* $dark for dark mode */
}

:deep(.q-field--outlined .q-field__control) {
  border-radius: 4px;
}

:deep(.q-field--outlined .q-field__control:before) {
  border-color: #475569; /* $forecolor1 for light mode */
}

:deep(.body--dark .q-field--outlined .q-field__control:before) {
  border-color: white; /* $forecolor2 for dark mode */
}

:deep(.q-field--outlined:hover .q-field__control:before) {
  border-color: #E2372D; /* $accent */
}

:deep(.q-field--focused .q-field__control:before) {
  border-color: #E2372D; /* $accent */
  box-shadow: 0 0 0 1px #E2372D; /* $accent */
}

:deep(.selected-option) {
  background-color: #F8FAFC !important; /* $selected-list-item */
}

:deep(.body--dark .selected-option) {
  background-color: #1D1D1D !important; /* $dark for dark mode */
}

:deep(.normal-option) {
  background-color: transparent;
}
</style>