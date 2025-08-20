import { defineStore } from 'pinia'

export const useChartStore = defineStore('chartStore', {
  state: () => ({
    layout: {},
    seriesCollection: [],
    seriesStore: [],
    xVariableName: "",
    chartId: ""
  }),

  getters: {
    layout: (state) => state.layout,
    seriesCollection: (state) => state.seriesCollection,
    seriesStore: (state) => state.seriesStore,
    xVariableName: (state) => state.xVariableName,
    chartId: (state) => state.chartId,
  },

  actions: {
    SetChartData(payload) {
      this.layout = payload.layout;
      this.seriesCollection = payload.seriesCollection;
      this.seriesStore = payload.seriesStore;
      this.xVariableName = payload.xVariableName;
      this.chartId = payload.chartId;

      console.log("chartStore.seriesCollection", this.seriesCollection);
    }
  }
});