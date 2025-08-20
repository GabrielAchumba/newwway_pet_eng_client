<template>
  <div class="row">
    <!-- Label with or without unit -->
    <div :class="'col-' + col1 + ' q-pt-sm text-accent'">
      {{ variableName }} <span v-if="hasUnit">({{ unit }})</span>
    </div>

    <!-- Modern QInput with full theming -->
    <div :class="'col-' + col2 + ' q-pa-sm text-accent'">
      <q-input
        dense
        outlined
        v-model="inputValue"
        :type="dataType"
        :disable="disabled"
        :placeholder="placeholder"
        class="modern-input"
        input-class="text-center"
        @update:model-value="onInput"
      >
        <template v-slot:append>
          <q-icon name="info" class="cursor-pointer">
            <q-tooltip>{{ toolTipDescription }}</q-tooltip>
          </q-icon>
        </template>
      </q-input>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    col1: { type: String, default: "3" },
    col2: { type: String, default: "5" },
    col3: { type: String, default: "4" },
    variable: { type: [String, Number], default: "" },
    variableName: { type: String, default: "" },
    unit: { type: String, default: "" },
    hasUnit: { type: Boolean, default: false },
    toolTipDescription: { type: String, default: "" },
    dataType: { type: String, default: "text" },
    disabled: { type: Boolean, default: false },
    placeholder: { type: String, default: "" }
  },
  data () {
    return {
      inputValue: this.variable
    }
  },
  watch: {
    variable (newVal) {
      this.inputValue = newVal
    }
  },
  methods: {
    onInput (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style scoped>
.modern-input {
  background-color: var(--q-color-accent);
  color: var(--q-color-primary);
  border-radius: 8px;
  transition: all 0.3s ease;
}
</style>
