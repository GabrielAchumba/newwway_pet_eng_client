<template>
  <div class="q-pa-md property-grid bg-white">
    <q-card flat bordered class="property-card">
      <!-- Header -->
      <div class="property-header">
        <div class="header-left">
          <q-icon name="settings" size="18px" class="q-mr-sm" />
          <span class="text-subtitle1">Properties</span>
        </div>
        <div class="header-right">
          <q-input
            dense
            outlined
            v-model="filter"
            placeholder="Search properties..."
            debounce="200"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>

      <q-separator />

      <!-- Scrollable area so sticky headers work -->
      <div class="grid-scroll" ref="scrollArea">
        <div v-for="(category, ci) in filteredCategories" :key="ci" class="category-wrap">

          <!-- Sticky Category Header -->
          <div class="category-header" :class="{ collapsed: collapsed[ci] }" @click="toggleCategory(ci)">
            <div class="category-left">
              <q-icon :name="collapsed[ci] ? 'chevron_right' : 'expand_more'" size="18px" class="q-mr-sm"/>
              <strong>{{ category.name }}</strong>
            </div>
            <div class="category-right">{{ category.properties.length }} props</div>
          </div>

          <!-- Property list (animated collapse) -->
          <transition name="collapse">
            <div v-show="!collapsed[ci]" class="property-list">
              <div
                v-for="(prop, pi) in category.properties"
                :key="prop.name"
                class="property-row"
                :class="{ changed: prop._justChanged }
                "
                @contextmenu.prevent="openContextMenu($event, category, prop)"
              >
                <div class="prop-name">{{ prop.name }}</div>
                <div class="prop-editor">
                  <!-- text -->
                  <q-input
                    style="width: 100%"
                    v-if="prop.type === 'text'"
                    dense
                    outlined
                    v-model="prop.value"
                    @blur="onPropEdited(category, prop)"
                  />

                  <!-- number -->
                  <q-input
                    style="width: 100%"
                    v-else-if="prop.type === 'number'"
                    dense
                    outlined
                    type="number"
                    v-model.number="prop.value"
                    @blur="onPropEdited(category, prop)"
                  />

                  <!-- select -->
                  <q-select
                    style="width: 100%"
                    v-else-if="prop.type === 'select'"
                    dense
                    outlined
                    :options="prop.options"
                    v-model="prop.value"
                    @update:model-value="onPropEdited(category, prop)"
                    emit-value
                    map-options
                  />

                  <!-- boolean -->
                  <q-toggle
                    style="width: 100%"
                    v-else-if="prop.type === 'boolean'"
                    v-model="prop.value"
                    color="secondary"
                    @update:model-value="onPropEdited(category, prop)"
                  />

                  <!-- color with dialog -->
                  <q-input
                    style="width: 100%"
                    v-else-if="prop.type === 'color'"
                    dense
                    outlined
                    v-model="prop.value"
                    readonly
                  >
                    <template v-slot:append>
                      <q-icon
                        name="palette"
                        :style="{ color: prop.value }"
                        class="cursor-pointer"
                        @click="pickColor(category, prop)"
                      />
                    </template>
                  </q-input>

                  <!-- date with dialog -->
                  <q-input
                    style="width: 100%"
                    v-else-if="prop.type === 'date'"
                    dense
                    outlined
                    v-model="prop.value"
                    readonly
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer" @click="pickDate(category, prop)" />
                    </template>
                  </q-input>

                  <!-- fallback display -->
                  <div v-else class="prop-display">{{ prop.value }}</div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

    </q-card>

    <!-- Color Picker Dialog -->
    <q-dialog v-model="colorDialog.visible">
      <q-card style="min-width:320px;">
        <q-card-section>
          <div class="text-h6">Pick a color</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-color v-model="colorDialog.tempValue" format-model="hex" no-header />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup @click="closeColorDialog" />
          <q-btn color="secondary" label="OK" @click="confirmColor" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Date Picker Dialog -->
    <q-dialog v-model="dateDialog.visible">
      <q-card style="min-width:320px;">
        <q-card-section class="bg-secondary">
          <div class="text-h6 text-white">Pick a date</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-date v-model="dateDialog.tempValue" mask="YYYY-MM-DD" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup @click="closeDateDialog" />
          <q-btn color="secondary" label="OK" @click="confirmDate" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Context menu -->
    <q-menu v-model="menu.visible" :anchor="menu.anchor" self="top right" fit>
      <q-list style="min-width:160px">
        <q-item clickable v-ripple @click="resetToDefault(menu.context.cat, menu.context.prop)">
          <q-item-section>Reset to Default</q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="copyValue(menu.context.prop)">
          <q-item-section>Copy Value</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-ripple @click="toggleDefault(menu.context.prop)">
          <q-item-section>{{ menu.context.prop && menu.context.prop._isDefault ? 'Unset Default' : 'Set as Default' }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>

  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'

// Filter/search
const filter = ref('')

// Sample data w/ default values
const categories = ref([
      {
        name: 'Geometry',
        properties: [
          { name: 'Hole Section', type: 'text', value: 'My Application', default: 'My Application', readonly: true },
          { name: 'Drill Pipes', type: 'text', value: '1.0.0', default: '1.0.0', readonly: true },
          { name: 'Deviation Survey', type: 'text', value: 'Gabriel Achumba', default: 'Gabriel Achumba', readonly: true }
        ]
      },
      {
        name: 'Fluid',
        properties: [
          { name: 'Drill Mud', type: 'select', value: 'Light', options: ['Light', 'Dark', 'System'], default: 'Light', readonly: true },
          { name: 'Mud PVT', type: 'color', value: '#1976D2', default: '#1976D2', readonly: true },
          { name: 'Others', type: 'number', value: 14, default: 14, readonly: true }
        ]
      },
      {
        name: 'Miscellaneous',
        properties: [
          { name: 'Operations', type: 'boolean', value: true, default: true, readonly: true },
          { name: 'Common', type: 'number', value: 100, default: 100, readonly: true },
        ]
      }
    ])

// Expand/collapse state
const collapsed = reactive({})

// Initialize collapsed
onMounted(() => {
  categories.value.forEach((c, i) => (collapsed[i] = false))
  // ensure props have helper flags
  categories.value.forEach(cat => {
    cat.properties.forEach(p => {
      p._justChanged = false
      p._isDefault = !!(p.default !== undefined)
    })
  })
})

// Filtered categories (search)
const filteredCategories = computed(() => {
  if (!filter.value) return categories.value
  const q = filter.value.toLowerCase()
  return categories.value
    .map(cat => ({
      ...cat,
      properties: cat.properties.filter(p => p.name.toLowerCase().includes(q))
    }))
    .filter(cat => cat.properties.length > 0)
})

function toggleCategory(index) {
  collapsed[index] = !collapsed[index]
}

// --- Picker dialogs state ---
const colorDialog = ref({ visible: false, category: null, prop: null, tempValue: '' })
const dateDialog = ref({ visible: false, category: null, prop: null, tempValue: '' })

function pickColor(category, prop) {
  colorDialog.value.visible = true
  colorDialog.value.category = category
  colorDialog.value.prop = prop
  colorDialog.value.tempValue = prop.value || '#000000'
}
function confirmColor() {
  const { prop, tempValue } = colorDialog.value
  if (prop) {
    prop.value = tempValue
    onPropEdited(colorDialog.value.category, prop)
  }
  colorDialog.value.visible = false
}
function closeColorDialog() {
  colorDialog.value.visible = false
}

function pickDate(category, prop) {
  dateDialog.value.visible = true
  dateDialog.value.category = category
  dateDialog.value.prop = prop
  dateDialog.value.tempValue = prop.value || new Date().toISOString().slice(0, 10)
}
function confirmDate() {
  const { prop, tempValue } = dateDialog.value
  if (prop) {
    prop.value = tempValue
    onPropEdited(dateDialog.value.category, prop)
  }
  dateDialog.value.visible = false
}
function closeDateDialog() {
  dateDialog.value.visible = false
}

// --- Editing & animations ---
function onPropEdited(category, prop) {
  // flash animation
  prop._justChanged = true
  setTimeout(() => (prop._justChanged = false), 900) // keep it short

  // log or emit changes here
  console.log('Property changed', category.name, prop.name, '=>', prop.value)
}

// --- Context menu ---
const menu = ref({ visible: false, anchor: null, context: { cat: null, prop: null } })

function openContextMenu(evt, category, prop) {
  menu.value.anchor = { top: evt.clientY + 'px', left: evt.clientX + 'px' }
  menu.value.context = { cat: category, prop }
  menu.value.visible = true
}

function resetToDefault(category, prop) {
  if (!prop) return
  if (prop.default !== undefined) {
    prop.value = prop.default
    prop._isDefault = true
    onPropEdited(category, prop)
  }
  menu.value.visible = false
}

async function copyValue(prop) {
  if (!prop) return
  try {
    await navigator.clipboard.writeText(String(prop.value))
    // small visual feedback: set changed briefly
    prop._justChanged = true
    setTimeout(() => (prop._justChanged = false), 600)
  } catch (e) {
    console.warn('Clipboard unavailable', e)
  }
  menu.value.visible = false
}

function toggleDefault(prop) {
  if (!prop) return
  if (prop._isDefault) {
    delete prop.default
    prop._isDefault = false
  } else {
    prop.default = prop.value
    prop._isDefault = true
  }
  menu.value.visible = false
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
  border-radius: 10px;
  overflow: hidden;
}

.property-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: linear-gradient(90deg, #f6f7f9, #ffffff);
}
.property-header .header-left { display:flex; align-items:center; gap:8px }
.property-header .header-right { margin-left: auto; width: 260px }

.grid-scroll {
  max-height: 520px;
  overflow-y: auto;
  scrollbar-width: none;      /* Firefox */
  -ms-overflow-style: none;   /* IE and Edge */
}

.grid-scroll::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.category-wrap { border-top: 1px solid #eee; }

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: linear-gradient(90deg, #fafafa, #f7f7f7);
  border-bottom: 1px solid #e8e8e8;
  position: sticky;
  top: 0; /* sticky header */
  z-index: 5;
  cursor: pointer;
}
.category-header.collapsed { opacity: 0.95 }
.category-header strong { font-weight: 600 }

.property-list { padding: 8px 0 }
.property-row {
  display: flex;
  grid-template-columns: 1fr 1.5fr;
  gap: 12px;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px dashed #efefef;
  transition: background-color 0.6s ease, transform 0.12s ease;
}
.property-row:hover { background-color: rgba(20,20,20,0.01); transform: translateY(-1px) }

.prop-name { color: #333; font-size: 14px; flex: 0 0 150px; }
.prop-editor { display:flex; align-items:center; flex: 1; }

/* change highlight animation - mimic WPF flash */
.property-row.changed {
  animation: propFlash 0.9s ease-in-out;
}
@keyframes propFlash {
  0% { background-color: rgba(76,175,80,0.18) }
  50% { background-color: rgba(76,175,80,0.08) }
  100% { background-color: transparent }
}

/* collapse transition */
.collapse-enter-active, .collapse-leave-active { transition: all 0.18s ease }
.collapse-enter-from, .collapse-leave-to { height: 0; opacity: 0 }

/* small responsive tweaks */
@media (max-width: 700px) {
  .property-row { grid-template-columns: 1fr; }
  .property-header .header-right { width: 160px }
}
</style>