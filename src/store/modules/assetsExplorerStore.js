import { defineStore } from 'pinia'

export const useAssetsExplorerStore = defineStore('assetsExplorerStore', {
  state: () => ({
    isAssetsExplorerActivated: false,
    assetExplorerTitle: "",
    listItems: [],
    isCheckBoxActive: false,
    selectedItem: {},
    isAssetCategorySelector: false,
    networkNodes: [],
    networkConnections: [],
    assetGroupId: 0, 
    assetId: 0
  }),

  actions: {
    setStateData(variableName, variableValue) {
      this[variableName] = variableValue;
      //console.log(variableName, this[variableName])
    },

    SetIsAssetsExplorerActivated(payload) {
      this.isAssetsExplorerActivated = payload;
    },

    toggleIsAssetsExplorerActivated() {
        this.isAssetsExplorerActivated = !this.isAssetsExplorerActivated;
    },

    setIsAssetCategorySelector(payload) {
        this.isAssetCategorySelector = payload;
    }

  }
});