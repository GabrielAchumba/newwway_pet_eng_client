import { defineStore } from 'pinia'

export const useAssetGroupsStore = defineStore('assetGroupsStore', {
  state: () => ({
    assetGroups: [],
    selectedAssetGroup: {
        assetGroupName: "",
        assetGroupDescription: "",
        id: -1,
    },
    activeDrainagePoint: {
        name: "",
        description: "",
        id: -1,
    },
  }),

  actions: {
    setStateData(variableName, variableValue) {
      this[variableName] = variableValue;
    },

  }
});