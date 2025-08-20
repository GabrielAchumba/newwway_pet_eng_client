<template>
  <div class="q-pa-md property-grid bg-white">
    <q-card flat bordered class="q-pa-sm">
      <q-toolbar class="bg-white q-pa-sm">
        <q-input
          dense
          outlined
          v-model="filter"
          placeholder="Search properties..."
          debounce="300"
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-toolbar>

      <q-separator />

      <q-table
        dense
        flat
        :rows="filteredProperties"
        :columns="columns"
        row-key="name"
        hide-bottom
        :pagination="{ rowsPerPage: 0 }"
      >
        <template v-slot:body-cell-value="props">
          <div>
            <!-- Text Input -->
            <q-input
              v-if="props.row.type === 'text'"
              dense
              outlined
              v-model="props.row.value"
              @blur="updateProperty(props.row)"
            />

            <!-- Select -->
            <q-select
              v-else-if="props.row.type === 'select'"
              dense
              outlined
              :options="props.row.options"
              v-model="props.row.value"
              @blur="updateProperty(props.row)"
            />

            <!-- Toggle -->
            <q-toggle
              v-else-if="props.row.type === 'boolean'"
              v-model="props.row.value"
              color="secondary"
              @blur="updateProperty(props.row)"
            />

            <!-- Date Picker -->
            <q-input
              v-else-if="props.row.type === 'date'"
              dense
              outlined
              v-model="props.row.value"
              mask="####-##-##"
              :rules="['date']"
              @blur="updateProperty(props.row)"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer" @click="openDatePicker(props.row)" />
              </template>
            </q-input>

            <!-- Default Display -->
            <span v-else>{{ props.row.value }}</span>
          </div>
        </template>
      </q-table>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filter = ref('')

const columns = [
  { name: 'name', label: 'Property', align: 'left', field: 'name', sortable: true },
  { name: 'value', label: 'Value', align: 'left', field: 'value' }
]

const properties = ref([
  { name: 'Title', type: 'text', value: 'My App' },
  { name: 'Theme', type: 'select', value: 'Light', options: ['Light', 'Dark'] },
  { name: 'Notifications', type: 'boolean', value: true },
  { name: 'Launch Date', type: 'date', value: '2025-08-12' },
  { name: 'Version', type: 'text', value: '1.0.0' }
])

const filteredProperties = computed(() => {
  if (!filter.value) return properties.value
  return properties.value.filter(p =>
    p.name.toLowerCase().includes(filter.value.toLowerCase())
  )
})

function updateProperty(row) {
  console.log('Updated property:', row.name, row.value)
}

function openDatePicker(row) {
  console.log('Open date picker for', row)
}
</script>

<style scoped>
.property-grid {
  width: 100%;
  max-width: none; /* remove fixed cap */
  margin: 0;       /* remove auto centering */
  height: 100%;    /* if needed for full-height panels */
  box-sizing: border-box;
}

.q-table th {
  background-color: var(--q-primary);
  font-weight: bold;
  text-transform: none;
}

.q-table td {
  border-bottom: 1px solid var(--q-primary);
}
</style>