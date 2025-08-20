import { defineStore } from 'pinia'

export const useAssetsExplorerStore = defineStore('assetsExplorerStore', {
  state: () => ({
    isAssetsExplorerActivated: false,
    assetExplorerTitle: "",
    listItems: [],
    isCheckBoxActive: false,
    selectedItem: {}
  }),

  actions: {
    setStateData(variableName, variableValue) {
      this[variableName] = variableValue;
    },

    SetIsAssetsExplorerActivated(payload) {
      this.isAssetsExplorerActivated = payload;
    },

    toggleIsAssetsExplorerActivated() {
        this.isAssetsExplorerActivated = !this.isAssetsExplorerActivated;
    }

  }
});