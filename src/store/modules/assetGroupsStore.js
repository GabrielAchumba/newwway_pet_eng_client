import { defineStore } from 'pinia'

export const useAssetGroupsStore = defineStore('assetGroupsStore', {
  state: () => ({
    assetGroups: [],
    selectedAssetGroup: {
        assetGroupName: "",
        assetGroupDescription: ""
    },
  }),

  actions: {
    setStateData(variableName, variableValue) {
      this[variableName] = variableValue;
    },

  }
});