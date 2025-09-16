import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebarStore', {
  state: () => ({
    items: [],
    selectedItem: {
        name: '',
        icon: '',
        route: '',
        isReadOnly: false
    },
  }),

  actions: {
    setStateData(variableName, variableValue) {
      this[variableName] = variableValue;
    },

  }
});