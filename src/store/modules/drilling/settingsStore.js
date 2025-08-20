// stores/settingsStore.js
import { defineStore } from 'pinia'
import { https } from 'src/httpservices/services'
import { useDataImportStore } from './dataImportStore'
import { useAuthStore } from '../authStore'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    isSetting: false,
    menuTabs: [
      { id: 1, caption: 'Inputs', isRibbonActive: false },
      { id: 2, caption: 'Home', isRibbonActive: false },
      { id: 3, caption: 'General Outputs', isRibbonActive: false },
      { id: 4, caption: 'Torque & Drag', isRibbonActive: false },
      { id: 5, caption: 'Hydraulics', isRibbonActive: false },
      { id: 6, caption: 'Well Control', isRibbonActive: false },
      { id: 7, caption: 'Surge & Swab', isRibbonActive: false },
      { id: 8, caption: 'Tubing Stress Analysis', isRibbonActive: false },
      { id: 8, caption: 'Cementing', isRibbonActive: false },
    ],
    common: {
      activeFluid: '',
      startMeasuredDepth: null,
      endMeasuredDepth: null,
      stepSize: null,
      seaWaterDensity: null,
      courseLength: null,
      youngsModulus: null,
      blockWeight: null,
      percentOfYield: null,
      bucklingLimitFactor: 1.0
    },
    isFromDB: false,
    tabCaption: 'Datum Details',
    tabCaptionRight: 'Well Explorer'
  }),

  getters: {
    isSetting: (state) => state.isSetting,
    tabCaptionRight: (state) => state.tabCaptionRight,
    menuTabs: (state) => state.menuTabs,
    common: (state) => state.common,
    isFromDB: (state) => state.isFromDB,
    tabCaption: (state) => state.tabCaption
  },

  actions: {
    setIsSetting(payload) {
      this.isSetting = payload
    },
    updatemenuTabs(payload) {
      const i = payload.id
      if (this.menuTabs[i]) {
        this.menuTabs[i].isRibbonActive = payload.isRibbonActive
      }
    },
    GetCommonLocal(payload) {
      if (Object.keys(payload).length <= 0) {
        console.log('state.common is empty: ', payload)
      } else {
        console.log('state.common is not empty: ', payload)
        this.common = payload
      }
      this.isFromDB = true
    },
    PostCommonLocal(payload) {
      this.common = payload
    },
    GetTabCaption(payload) {
      this.tabCaption = payload
    },
    GetTabCaptionRight(payload) {
      this.tabCaptionRight = payload
    },
    clearAnalysisSettings() {
      this.common = {
        activeFluid: '',
        startMeasuredDepth: null,
        endMeasuredDepth: null,
        stepSize: null,
        seaWaterDensity: null,
        courseLength: null,
        youngsModulus: null,
        blockWeight: null,
        percentOfYield: null,
        bucklingLimitFactor: 1.0
      }
    },

    async GetCommon(payload) {
      const dataImportStore = useDataImportStore()
      dataImportStore.setLoaderParameters({ showLoader: true, showImportView: false })

      const config = {
        headers: { tenantcode: payload.companyName },
        useCredentails: true
      }

      try {
        const response = await https().get(`Commons/GetCommon/${payload.designId}`, config)
        this.GetCommonLocal(response.data)
        dataImportStore.setLoaderParameters({ showLoader: false, showImportView: true })
        return response
      } catch (error) {
        dataImportStore.setLoaderParameters({ showLoader: false, showImportView: true })
        console.error('GetCommon error')
        throw error
      }
    },

    async PostCommon(payload) {
      const dataImportStore = useDataImportStore()
      const authStore = useAuthStore()

      const config = {
        headers: { tenantcode: payload.companyName },
        useCredentails: true
      }

      try {
        const response = await https().post('Commons/PostCommon', payload.common, config)
        this.PostCommonLocal(response.data)
        dataImportStore.setLoaderParameters({ showLoader: false, showImportView: true })
        authStore.setStatusMessageBarVisibility({
          actionMessage: 'Run parameters saved successfully',
          visibility: true
        })
        return response
      } catch (error) {
        dataImportStore.setLoaderParameters({ showLoader: false, showImportView: true })
        console.error('PostCommon error')
        throw error
      }
    }
  }
})