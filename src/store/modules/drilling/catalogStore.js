// src/stores/catalogStore.js
import { defineStore } from 'pinia'
import { https } from 'src/httpservices/services'

export const useCatalogStore = defineStore('catalogStore', {
  state: () => ({
    selectedSheetName: "",
    sheetsData: [],
    sheetNames: [],
    catalogWorkSheets: [
      {
        label: 'Catalog Work Sheets',
        avatar: '',
        children: [
          {
            label: 'Casing Catalog',
            icon: '',
            children: [
              { label: 'API casing' },
              { label: 'Hal_Re_Ca_Bu_Thr_Reg' },
              { label: 'Hal_Red_Ca_Extreme_line' },
              { label: 'Hal_Red_Ca_long_Round_Thread' },
              { label: 'Hal_Red_Casing_Plain_End' },
              { label: 'Hali_Red_casing_short_Rou_Thre' },
              { label: 'Vallourec_Casing_Catalog' },
              { label: 'Antares PJD' },
              { label: 'API Connection Catalog' },
              { label: 'GC Tubulars TCC 3P' },
              // ... (add rest of the sheet items here)
            ]
          },
          {
            label: 'Drill Collars',
            icon: '',
            children: [
              { label: 'API Drill collars (non magnetic)' },
              { label: 'API drill collars (Magnetic)' }
            ]
          },
          {
            label: 'Drill Pipe Catalog',
            icon: '',
            children: [
              { label: 'API Drill Pipes' },
              { label: 'Grant Prideco' },
              { label: 'Halliburton Redbook EU' },
              { label: 'Halliburton Redbook IEU' },
              { label: 'Halliburton Redbook IU' }
            ]
          }
        ]
      }
    ]
  }),

  getters: {
    catalogWorkSheets: (state) => state.catalogWorkSheets,
    sheetsData: (state) => state.sheetsData,
    sheetNames: (state) => state.sheetNames,
  },

  actions: {
    setWorkSheetData(payload) {
      this.sheetNames = payload.sheetNames
      this.sheetsData = payload.sheetsData
    },

    async saveSelectedTable(payload) {
      try {
        const response = await https().post('Catalogs/SaveSelectedTable', payload)

        // You will need access to root stores manually in Pinia
        const dataImportStore = useDataImportStore() // you must import this store
        const authStore = useAuthStore() // you must import this store

        dataImportStore.SetLoaderParameters({
          showLoader: false,
          showImportView: true
        })

        authStore.setStatusMessageBarVisibility({
          actionMessage: `${payload.selectedDataTableName} saved successfully`,
          visibility: true
        })

        return response
      } catch (error) {
        console.log("saveSelectedTable error")

        const dataImportStore = useDataImportStore()
        const authStore = useAuthStore()

        dataImportStore.SetLoaderParameters({
          showLoader: false,
          showImportView: true
        })

        authStore.setStatusMessageBarVisibility({
          actionMessage: `${payload.selectedDataTableName} failed to save. Please check your data`,
          visibility: true
        })

        throw error
      }
    }
  }
})