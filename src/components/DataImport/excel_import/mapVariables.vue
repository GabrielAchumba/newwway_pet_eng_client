<template>
  <div class="map-variables-page">
    <div class="map-variables-container q-pa-md">

      <div class="row q-col-gutter-md">
        <div
          v-for="(applicationColumn, i) in applicationColumns"
          :key="applicationColumn.id"
          class="col-12"
        >
          <div class="map-row q-pa-md">
            <!-- Application Column -->
            <div class="col-section">
              <p class="section-label">Application Column</p>
              <NSelect
                :qSelect="applicationColumns[i]"
                @onQSelectItemValueChanged="onApplicationColumnChanged($event)"
                @onToggle="onToggle"
              />
            </div>

            <!-- Worksheet Column -->
            <div class="col-section">
              <p class="section-label">Worksheet Column</p>
              <NSelect
                :qSelect="worksheetColumns[i]"
                @onQSelectItemValueChanged="onWorksheetColumnChanged($event)"
              />
            </div>

            <!-- Data Type -->
            <div class="col-section">
              <p class="section-label">Data Type</p>
              <NSelect
                :qSelect="dataTypes[i]"
                @onQSelectItemValueChanged="onDataTypeChanged($event)"
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import NSelect from "../../drop_down/n-select.vue";

export default {
  components: { NSelect },
  props: {
    applicationColumns: { type: Array, default: () => [] },
    worksheetColumns: { type: Array, default: () => [] },
    dataTypes: { type: Array, default: () => [] },
    qToggles: { type: Array, default: () => [] },
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
  },
};
</script>

<style lang="scss" scoped>
@use "sass:color";

.map-variables-page {
  background-color: white;
//   min-height: 100vh;
  overflow-y: auto;

  /* Hide scrollbar but keep scroll functionality */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE & Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
  }
}

.map-variables-container {
  max-width: 1100px;
  margin: 0 auto;
}

.map-row {
  display: flex;
  flex-wrap: nowrap;
  background-color: $primary;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.10);
  border-left: 4px solid $card-bar;
  gap: 1rem;
}


.col-section {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.section-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: $secondary;
  margin-bottom: 6px;
}
</style>