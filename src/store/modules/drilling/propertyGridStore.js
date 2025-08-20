// stores/propertyGridStore.js
import { defineStore } from 'pinia'

export const usePropertyGridStore = defineStore('propertyGrid', {
  state: () => ({
    isWellSchematic: false,
    propertyLists1: [],
    propertyLists2: [],
    formationProperties: {
      colorFormation: '#a26c37',
      yOffSet: 0
    },
    isFormation: false,
    isOpenHole: false,
    isBuckling: false,
    openHoleProperties: {
      colorOpenHoleAnnulus: 'gray',
      holeAnnulus: 10
    },
    bucklingProperties: {
      colorHelicalBuckling: 'orange',
      colorSinusiodalBuckling: 'yellow',
      selectedSensitivity: '1',
      selectedOperation: ''
    }
  }),

  getters: {
    isWellSchematic: state => state.isWellSchematic,
    isBuckling: state => state.isBuckling,
    bucklingProperties: state => state.bucklingProperties,
    openHoleProperties: state => state.openHoleProperties,
    isFormation: state => state.isFormation,
    isOpenHole: state => state.isOpenHole,
    propertyLists1: state => state.propertyLists1,
    propertyLists2: state => state.propertyLists2,
    formationProperties: state => state.formationProperties
  },

  actions: {
    setPropertyLists1(payload) {
      this.propertyLists1 = payload
    },
    setPropertyLists2(payload) {
      this.propertyLists2 = payload
    },
    setFormationProperties(payload) {
      this.formationProperties = payload
    },
    setOpenHoleProperties(payload) {
      this.openHoleProperties = payload
    },
    setActivePropertyView(payload) {
      this.isFormation = payload.isFormation
      this.isOpenHole = payload.isOpenHole
      this.isBuckling = payload.isBuckling
    },
    setBucklingProperties(payload) {
      this.bucklingProperties = payload
    },
    setCurrentRoutePropertyGrid(payload) {
      const currentRoute = payload
      this.isWellSchematic = false
      switch (currentRoute) {
        case '/formationTops':
          this.isWellSchematic = true
          break
      }
    }
  }
})