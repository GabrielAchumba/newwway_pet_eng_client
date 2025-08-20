<template>
  <div class="row items-center q-col-gutter-sm">
    <div :class="'col-' + col1 + ' text-secondary q-pa-sm'">
      <label :for="variableName" class="text-bold">{{ variableName }}</label>
    </div>

    <div :class="'col-' + col2 + ' q-pa-sm'">
      <div class="q-select-wrapper">
        <select
          :id="variableName"
          :name="variableName"
          class="combo-box"
          @change="onSelectionChanged"
        >
          <option
            v-for="item in listOfData"
            :key="item.id"
            :value="item.id"
          >
            {{ item.datumName }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    col1: {
      type: String,
      default: "3"
    },
    col2: {
      type: String,
      default: "5"
    },
    col3: {
      type: String,
      default: "4"
    },
    variable: {
      type: String,
      default: ""
    },
    variableName: {
      type: String,
      default: ""
    },
    listOfData: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    getWeight() {
      return this.variableName;
    },
    onSelectionChanged(e) {
      const selectedName = e.target.options[e.target.selectedIndex].text;
      this.$emit('onSelectionChanged', selectedName);
    }
  }
};
</script>

<style scoped>
.combo-box {
  width: 100%;
  padding: 8px 12px;
  /* border: 1px solid var(--q-secondary); */
  border-radius: 8px;
  background-color: var(--q-primary);
  color: var(--q-secondary);
  text-align: center;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.combo-box:focus {
  border-color: var(--q-primary);
  box-shadow: 0 0 0 2px rgba(0, 128, 255, 0.2);
}
</style>