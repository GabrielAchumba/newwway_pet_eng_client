import { defineStore } from 'pinia'

export const useDataVisualizationStore = defineStore('dataVisualization', {
  state: () => ({
    isDataVisualization: false,
    listOfData: [],
    seriesNames: []
  }),

  getters: {
    isDataVisualization: (state) => state.isDataVisualization,
    listOfData: (state) => state.listOfData,
    seriesNames: (state) => state.seriesNames
  },

  actions: {
    setIsDataVisualization(payload) {
      this.isDataVisualization = payload
    },

    GetListOfData(payload) {
      this.listOfData = []
      this.seriesNames = []
      
      const simulationResult = payload.simulationResults[0]
      const variables = Object.keys(simulationResult)
      const length = variables.length
      const lengthJ = payload.simulationResults.length

      // First pass: create series for each variable we want to track
      for (let i = 0; i < length; i++) {
        let check = false
        let VariableName = ""

        switch(variables[i]) {
          case "pipeOuterArea":
            check = true
            VariableName = "Pipe Outer Area"
            break
          case "pipeInnerArea":
            check = true
            VariableName = "Pipe Inner Area"
            break
          case "pipeTotalWeight":
            check = true
            VariableName = "Pipe Total Weight"
            break
        }

        if (check) {
          const series = {
            x: [],
            y: [],
            line: {
              shape: 'spline'
            },
            mode: 'lines',
            type: 'scatter',
            name: VariableName,
          }

          this.listOfData.push(series)
          this.seriesNames.push(VariableName)
        }
      }

      // Second pass: populate data for each series
      for (let j = 0; j < lengthJ; j++) {
        for (let i = 0; i < this.listOfData.length; i++) {
          const y = payload.simulationResults[j].bottomMeasuredDepth / 0.3048
          const currentVar = this.listOfData[i].name.replace(/ /g, '').toLowerCase()

          switch(currentVar) {
            case "pipeouterarea":
              this.listOfData[i].x.push(payload.simulationResults[j].pipeOuterArea)
              this.listOfData[i].y.push(y)
              break
            case "pipeinnerarea":
              this.listOfData[i].x.push(payload.simulationResults[j].pipeInnerArea)
              this.listOfData[i].y.push(y)
              break
            case "pipetotalweight":
              this.listOfData[i].x.push(payload.simulationResults[j].pipeTotalWeight)
              this.listOfData[i].y.push(y)
              break
          }
        }
      }
    }
  }
})