<template>
  <q-page padding class="column q-gutter-md">
    <div class="row q-col-gutter-md items-end">
      <div class="col-auto">
        <input ref="dirInput" type="file" webkitdirectory multiple class="hidden" @change="onFoldersPicked" />
        <q-btn color="primary" class="bg-secondary" label="Pick folders…" @click="pickFolders" />
      </div>

      <div class="col-5">
        <q-select
          v-model="selectedSample"
          :options="sampleOptions"
          color="secondary"
          option-label="label"
          option-value="file"
          label="Sample workbook for sheet names"
          dense outlined clearable use-input
          @filter="filterSamples"
        />
      </div>

      <div class="col-3">
        <q-select
          v-model="selectedSheet"
          :options="sheets"
          color="secondary"
          label="Worksheet"
          dense outlined :disable="!selectedSample"
        />
      </div>

      <div class="col-auto">
        <q-btn label="Load Sheets" color="secondary" :disable="!selectedSample" @click="loadSheetsFromSample" />
      </div>

      <div class="col-auto">
        <q-btn label="Aggregate & Send" color="accent" :disable="!selectedSheet || pickedFiles.length===0" @click="startAggregate" />
      </div>

      <div class="col-auto" v-if="running">
        <q-btn flat color="negative" label="Cancel" @click="cancel" />
      </div>
    </div>

    <q-banner v-if="meta" class="bg-grey-2">{{ meta }}</q-banner>
    <div class="row items-center q-gutter-sm">
      <q-badge color="primary">Rows sent: {{ sentCount }}</q-badge>
      <q-badge color="secondary">Files: {{ fileCount }}</q-badge>
      <q-badge color="orange" v-if="errors.length">Errors: {{ errors.length }}</q-badge>
    </div>

    <q-table
      class="q-mt-md"
      :rows="rowsPreview"
      :columns="columns"
      row-key="__rk"
      virtual-scroll
      :virtual-scroll-item-size="36"
      :rows-per-page-options="[0]"
      flat bordered dense
      title="Preview (first few thousand rows)"
    />
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import * as XLSX from 'xlsx'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const dirInput = ref(null)
const pickedFiles = ref([])
const sampleOptions = ref([])
const filteredSampleOptions = ref(sampleOptions.value)
const selectedSample = ref(null)
const selectedSheet = ref(null)
const sheets = ref([])
const running = ref(false)
const meta = ref('')
const sentCount = ref(0)
const fileCount = ref(0)
const errors = ref([])
const rowsPreview = ref([])
const columns = ref([])
let aborter = null

// Helpers
function pickFolders() {
  dirInput.value?.click()
}
function onFoldersPicked(e) {
  //const input = e.target

  const files = e.target.files

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    //console.log("File:", file.webkitRelativePath, file.name, file.type, file.size)
    // you can now send each file to backend, or parse it with SheetJS in frontend
  }

  if (!files) return
  // Filter .xlsx/.xlsm files
  pickedFiles.value = Array.from(files).filter(f => /\.(xls|xlsx|xlsm)$/i.test(f.name))
  fileCount.value = pickedFiles.value.length
  // Build sample list (limit for dropdown)
  sampleOptions.value = pickedFiles.value.slice(0, 200).map(f => ({ label: f.webkitRelativePath || f.name, file: f }))
  filteredSampleOptions.value = sampleOptions.value
  //console.log(sampleOptions)
  selectedSample.value = sampleOptions.value[0]?.label ?? null
  //selectedSample.value = sampleOptions.value[0]?.file ?? null
  meta.value = `Selected ${fileCount.value} workbook(s).`
}

function filterSamples(val, update) {
  update(() => {
    if (!val) {
      filteredSampleOptions.value = sampleOptions.value
      return
    }
    const v = val.toLowerCase()
    filteredSampleOptions.value = sampleOptions.value.filter(x => x.label.toLowerCase().includes(v))
  })
}

async function loadSheetsFromSample() {
  if (!selectedSample.value) return
  const buf = await selectedSample.value.arrayBuffer()
  const wb = XLSX.read(buf)
  sheets.value = wb.SheetNames
  if (!sheets.value.includes(selectedSheet.value || '')) {
    selectedSheet.value = sheets.value[0] || null
  }
}

function buildColumnsFromRow(obj) {
  const keys = Object.keys(obj)
  columns.value = keys.map(k => ({
    name: k, label: k, field: (r) => r[k], align: 'left', sortable: true
  }))
}

function takeHeader(ws) {
  const aoa = XLSX.utils.sheet_to_json(ws, { header: 1 })
  const first = (aoa[0] || []).map(v => (v ?? '').toString().trim())
  return first
}

function* toObjects(rows, headers) {
  for (const r of rows) {
    const obj = {}
    for (let i = 0; i < headers.length; i++) {
      obj[headers[i] || `col_${i+1}`] = r[i] ?? null
    }
    yield obj
  }
}

async function startAggregate() {
  if (!selectedSheet.value || pickedFiles.value.length === 0) return

  running.value = true
  sentCount.value = 0
  rowsPreview.value = []
  columns.value = []
  errors.value = []
  meta.value = `Parsing & streaming "${selectedSheet.value}"…`

  aborter = new AbortController()

  const uploadUrl = `${API}/excel/ingest?sheet=${encodeURIComponent(selectedSheet.value)}`
  const stream = new ReadableStream({
    start: controller => (controller),
    pull: () => {},
    cancel: () => {}
  })

  const uploadPromise = fetch(uploadUrl, {
    method: 'POST',
    body: stream,
    headers: { 'Content-Type': 'application/x-ndjson' },
    signal: aborter.signal
  }).then(async res => {
    if (!res.ok) throw new Error(`Upload failed: ${res.status} ${res.statusText}`)
  }).catch(e => errors.value.push(String(e)))

  const writer = stream.getWriter ? stream.getWriter() : null
  if (!writer) {
    errors.value.push('Streaming not supported in this browser.')
    running.value = false
    return
  }

  async function writeLine(obj) {
    const line = JSON.stringify(obj) + '\n'
    await writer.write(new TextEncoder().encode(line))
  }

  const CHUNK_SIZE = 1000
  try {
    for (const file of pickedFiles.value) {
      if (!running.value) break

      try {
        const buf = await file.arrayBuffer()
        const wb = XLSX.read(buf, { cellDates: true })
        const ws = wb.Sheets[selectedSheet.value]
        if (!ws) continue

        const headers = takeHeader(ws)
        const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, range: 1, blankrows: false })
        let batch = []
        for (const obj of toObjects(aoa, headers)) {
          batch.push(obj)
          if (sentCount.value === 0 && rowsPreview.value.length === 0) {
            buildColumnsFromRow(obj)
          }
          if (rowsPreview.value.length < 5000) {
            rowsPreview.value.push({ __rk: `${rowsPreview.value.length}`, ...obj })
          }
          if (batch.length >= CHUNK_SIZE) {
            await writeLine({ type: 'rows', rows: batch, source: file.webkitRelativePath || file.name })
            sentCount.value += batch.length
            batch = []
          }
        }
        if (batch.length) {
          await writeLine({ type: 'rows', rows: batch, source: file.webkitRelativePath || file.name })
          sentCount.value += batch.length
        }
        await writeLine({ type: 'file_end', source: file.webkitRelativePath || file.name })
      } catch (e) {
        errors.value.push(`${file.name}: ${e.message || e}`)
        await writeLine({ type: 'error', source: file.name, message: String(e) })
      }
    }
    await writeLine({ type: 'end' })
  } finally {
    await writer.close()
    await uploadPromise
    running.value = false
    meta.value = `Done. Sent ${sentCount.value.toLocaleString()} rows.`
  }
}

function cancel() {
  running.value = false
  aborter?.abort()
}
</script>

<style scoped>
.hidden { display: none; }
</style>