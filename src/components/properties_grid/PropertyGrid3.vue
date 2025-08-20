<template>
  <div class="q-pa-md property-grid bg-white">
    <q-card flat bordered class="property-card">

      <!-- Title -->
      <div class="property-header">
        <q-icon name="settings" size="sm" class="q-mr-sm" />
        <span class="text-subtitle1">Properties</span>
      </div>

      <!-- Search -->
      <q-input
        dense
        outlined
        v-model="filter"
        placeholder="Search..."
        class="q-mb-sm"
        debounce="200"
        clearable
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <!-- Categories -->
      <div>
        <q-expansion-item
          v-for="(category, ci) in filteredCategories"
          :key="ci"
          :label="category.name"
          dense
          expand-icon="expand_more"
          header-class="property-category"
          class="q-mb-xs"
        >
          <q-table
            dense
            flat
            hide-header
            :rows="category.properties"
            :columns="columns"
            row-key="name"
            hide-bottom
            :pagination="{ rowsPerPage: 0 }"
            class="property-table"
          >
            <template v-slot:body-cell-value="props">
              <!-- Text -->
              <q-input
                v-if="props.row.type === 'text'"
                dense
                outlined
                v-model="props.row.value"
                @blur="updateProperty(category.name, props.row)"
              />

              <!-- Number -->
              <q-input
                v-else-if="props.row.type === 'number'"
                dense
                outlined
                type="number"
                v-model.number="props.row.value"
                @blur="updateProperty(category.name, props.row)"
              />

              <!-- Select -->
              <q-select
                v-else-if="props.row.type === 'select'"
                dense
                outlined
                :options="props.row.options"
                v-model="props.row.value"
                @update:model-value="updateProperty(category.name, props.row)"
              />

              <!-- Toggle -->
              <q-toggle
                v-else-if="props.row.type === 'boolean'"
                v-model="props.row.value"
                color="secondary"
                @update:model-value="updateProperty(category.name, props.row)"
              />

              <!-- Color Picker -->
              <q-input
                v-else-if="props.row.type === 'color'"
                dense
                outlined
                v-model="props.row.value"
                readonly
              >
                <template v-slot:append>
                  <q-icon
                    name="palette"
                    :style="{ color: props.row.value }"
                    class="cursor-pointer"
                    @click="pickColor(category.name, props.row)"
                  />
                </template>
              </q-input>

              <!-- Date Picker -->
              <q-input
                v-else-if="props.row.type === 'date'"
                dense
                outlined
                v-model="props.row.value"
                mask="####-##-##"
                readonly
              >
                <template v-slot:append>
                  <q-icon
                    name="event"
                    class="cursor-pointer"
                    @click="pickDate(category.name, props.row)"
                  />
                </template>
              </q-input>

              <!-- Default -->
              <span v-else>{{ props.row.value }}</span>
            </template>
          </q-table>
        </q-expansion-item>
      </div>
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

<script setup>
import { ref, computed } from 'vue'

const filter = ref('')

const columns = [
  { name: 'name', field: 'name', align: 'left' },
  { name: 'value', field: 'value', align: 'left' }
]

const categories = ref([
  {
    name: 'General',
    properties: [
      { name: 'Title', type: 'text', value: 'My Application' },
      { name: 'Version', type: 'text', value: '1.0.0' },
      { name: 'Author', type: 'text', value: 'Gabriel Achumba' }
    ]
  },
  {
    name: 'Appearance',
    properties: [
      { name: 'Theme', type: 'select', value: 'Light', options: ['Light', 'Dark', 'System'] },
      { name: 'Primary Color', type: 'color', value: '#1976D2' },
      { name: 'Font Size', type: 'number', value: 14 }
    ]
  },
  {
    name: 'Advanced',
    properties: [
      { name: 'Enable Logs', type: 'boolean', value: true },
      { name: 'Max Connections', type: 'number', value: 100 },
      { name: 'Launch Date', type: 'date', value: '2025-08-12' }
    ]
  }
])

const filteredCategories = computed(() => {
  if (!filter.value) return categories.value
  return categories.value
    .map(cat => ({
      ...cat,
      properties: cat.properties.filter(p =>
        p.name.toLowerCase().includes(filter.value.toLowerCase())
      )
    }))
    .filter(cat => cat.properties.length > 0)
})

function updateProperty(categoryName, prop) {
  console.log(`Updated ${categoryName} -> ${prop.name}:`, prop.value)
}

const colorDialog = ref({
  visible: false,
  category: null,
  prop: null,
  tempValue: ''
})

const dateDialog = ref({
  visible: false,
  category: null,
  prop: null,
  tempValue: ''
})

function pickColor(categoryName, prop) {
  colorDialog.value.visible = true
  colorDialog.value.category = categoryName
  colorDialog.value.prop = prop
  colorDialog.value.tempValue = prop.value
}

function pickDate(categoryName, prop) {
  dateDialog.value.visible = true
  dateDialog.value.category = categoryName
  dateDialog.value.prop = prop
  dateDialog.value.tempValue = prop.value
}

function confirmColor() {
  colorDialog.value.prop.value = colorDialog.value.tempValue
  updateProperty(colorDialog.value.category, colorDialog.value.prop)
  colorDialog.value.visible = false
}

function confirmDate() {
  dateDialog.value.prop.value = dateDialog.value.tempValue
  updateProperty(dateDialog.value.category, dateDialog.value.prop)
  dateDialog.value.visible = false
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

.property-card {
  background: #fafafa;
  border-radius: 12px;
  overflow: hidden;
}

.property-header {
  display: flex;
  align-items: center;
  padding: 12px;
  background: linear-gradient(to right, #eceff1, #f5f5f5);
  border-bottom: 1px solid #ddd;
  font-weight: bold;
}

.property-category {
  background-color: #f0f0f0;
  font-weight: 600;
  font-size: 0.9rem;
}

.property-table td {
  padding: 6px 8px !important;
  border-bottom: 1px solid #e0e0e0;
}
</style>