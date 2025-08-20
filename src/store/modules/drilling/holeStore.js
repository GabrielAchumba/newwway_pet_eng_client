import { defineStore } from 'pinia'
import { https } from 'src/httpservices/services'
import { useDataImportStore } from './dataImportStore'
import { useAuthStore } from '../authStore'

export const useHoleStore = defineStore('hole', {
  state: () => ({
    holeSections: [],
    isImportDialogVisible: false,
    holeSection: {},
    holeSectionDescriptions: {
      outerDiameter: "PLease Enter Outer Diameter",
      innerDiameter: "PLease Enter Inner Diameter",
      weight: "PLease Enter Outer Weight",
      top: "PLease Enter Top MD",
      bottom: "PLease Enter Bottom MD",
      frictionFactor: "PLease Enter Friction Factor"
    }
  }),

  getters: {
    holeSectionDescriptions: (state) => state.holeSectionDescriptions,
    holeSections: (state) => state.holeSections,
    isImportDialogVisible: (state) => state.isImportDialogVisible,
    holeSection: (state) => state.holeSection
  },

  actions: {
    async GetHoleSections(payload) {
      const dataImportStore = useDataImportStore()
      dataImportStore.SetLoaderParameters({
        showLoader: true,
        showImportView: false
      })

      this.ClearHoleSections()

      const config = {
        headers: {
          tenantcode: payload.companyName,
        },
        useCredentails: true
      }

      try {
        const response = await https().get('HoleSections/GetHoleSections/' + payload.designId, config)
        this.holeSections = response.data
        dataImportStore.SetLoaderParameters({
          showLoader: false,
          showImportView: true
        })
        return response
      } catch (error) {
        console.log("GetHoleSections error")
        dataImportStore.SetLoaderParameters({
          showLoader: false,
          showImportView: true
        })
        throw error
      }
    },

    async PostHoleSection(payload) {
      const config = {
        headers: {
          tenantcode: payload.companyName,
        },
        useCredentails: true
      }

      try {
        const response = await https().post('HoleSections/PostHoleSection', payload, config)
        this.holeSection = response.data
        return response
      } catch (error) {
        console.log("PostHoleSection error")
        throw error
      }
    },

    async PostHoleSections(payload) {
      const dataImportStore = useDataImportStore()
      const authStore = useAuthStore()

      const config = {
        headers: {
          tenantcode: payload.companyName,
        },
        useCredentails: true
      }

      this.holeSections = payload.holeSections

      try {
        const response = await https().post('HoleSections/PostHoleSections', payload, config)
        this.isImportDialogVisible = false
        dataImportStore.SetLoaderParameters({
          showLoader: false,
          showImportView: true
        })
        authStore.setStatusMessageBarVisibility({
          actionMessage: "Hole sections parameters saved successfully",
          visibility: true
        })
        return response
      } catch (error) {
        console.log("PostHoleSections error")
        dataImportStore.SetLoaderParameters({
          showLoader: false,
          showImportView: true
        })
        throw error
      }
    },

    SaveHoleSectionTable(payload) {
      this.holeSections.push(payload)
      console.log("holeSections: ", this.holeSections)
    },

    ClearHoleSections() {
      this.holeSections = []
    },

    SetisImportDialogVisible(payload) {
      this.isImportDialogVisible = payload
    }
  }
})