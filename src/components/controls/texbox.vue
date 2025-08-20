<template>
  <div class="row">
    <!-- Label -->
    <div :class="'col-' + col1 + ' q-pt-sm text-secondary'">
      {{ variableName }}
      <span v-if="hasUnit">({{ unit }})</span>
    </div>

    <!-- Input -->
    <div :class="'col-' + col2 + ' q-pa-sm'">
      <q-input
        outlined
        dense
        class="bg-secondary text-secondary full-width text-box "
        :type="dataType"
        :model-value="variable"
        @update:model-value="$emit('input', $event)"
        :input-class="'text-center'"
        :label="toolTipDescription !== '' ? toolTipDescription : undefined"
        :hide-bottom-space="true"
        :color="'secondary'"
        :bg-color="'primary'"
        :label-color="'forecolor1'"
        :clearable="true"
      >
        <template v-if="toolTipDescription" v-slot:append>
          <q-tooltip>{{ toolTipDescription }}</q-tooltip>
        </template>
      </q-input>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    col1: {
      type: String,
      default: "3",
    },
    col2: {
      type: String,
      default: "5",
    },
    col3: {
      type: String,
      default: "4",
    },
    variable: {
      type: String,
      default: "",
    },
    variableName: {
      type: String,
      default: "",
    },
    unit: {
      type: String,
      default: "",
    },
    hasUnit: {
      type: Boolean,
      default: false,
    },
    toolTipDescription: {
      type: String,
      default: "",
    },
    dataType: {
      type: String,
      default: "text",
    },
  },
};
</script>

<style scoped>
.text-box {
  /* border: 1px solid var(--q-secondary); */
  border-radius: 8px;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

</style>