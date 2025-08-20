// src/stores/datum.ts
import { defineStore } from 'pinia'
import { https } from 'src/httpservices/services'

export const useDatumStore = defineStore('datumStore', {
  state: () => ({
    datum: {
      datumName: '',
      datumElevation: '',
      groundElevation: '',
      wellHeadElevation: '',
      airGap: ''
    },
    selectedInputTab: 'Datum',
    isInput: false,
    datums: [],
    datumNames: [],
    selectedDatum: {
      typeOfShore: "",
      datumName: "",
      datumElevation: '',
      groundElevation: '',
      wellHeadElevation: '',
      airGap: ''
    },
    datumDescriptions: {
      typeOfShore: '',
      datumName: 'Please select shore',
      datumElevation: 'Please enter datum elevation',
      groundElevation: 'Please enter ground elevation',
      wellHeadElevation: 'Please enter wellhead elevation',
      airGap: 'Please enter air gap'
    },
    datumLabels: {
      typeOfShore: "Shore",
      datumName: 'Datum Name',
      datumElevation: 'Datum Elevation',
      groundElevation: 'Ground Elevation',
      wellHeadElevation: 'WellHead Elevation',
      airGap: 'Air Gap'
    }
  }),

  getters: {
    getDatumDescriptions: state => state.datumDescriptions,
    getDatum: state => state.datum,
    getDatums: state => state.datums,
    getDatumNames: state => state.datumNames,
    getSelectedDatum: state => state.selectedDatum
  },

  actions: {
    postDatum(payload) {
      const config = {
        headers: {
          tenantcode: payload.companyName
        },
        useCredentails: true
      }

      return new Promise((resolve, reject) => {
        https()
          .post('Datums/PostDatum', payload, config)
          .then(response => {
            this.datum = response.data

            // Equivalent to context.commit('dataImportStore/SetLoaderParameters', ...)
            const dataImportStore = useDataImportStore()
            dataImportStore.setLoaderParameters({
              showLoader: false,
              showImportView: true
            })

            const authStore = useAuthStore()
            authStore.setStatusMessageBarVisibility({
              actionMessage: 'Datum saved successfully',
              visibility: true
            })

            // Fetch datums again
            this.fetchDatums({
              companyName: payload.companyName,
              designId: payload.designId,
              userId: payload.userId
            })

            resolve(response)
          })
          .catch(error => {
            const dataImportStore = useDataImportStore()
            dataImportStore.setLoaderParameters({
              showLoader: false,
              showImportView: true
            })
            reject(error)
          })
      })
    },

    fetchDatums(payload) {
      const config = {
        headers: {
          tenantcode: payload.companyName
        },
        useCredentails: true
      }

      const dataImportStore = useDataImportStore()
      dataImportStore.setLoaderParameters({
        showLoader: true,
        showImportView: false
      })

      return new Promise((resolve, reject) => {
        https()
          .get('Datums/GetDatums/' + payload.designId, config)
          .then(response => {
            this.datums = response.data
            this.datumNames = []
            if (this.datums.length > 0) {
              this.selectedDatum = this.datums[0]
              this.datum = this.datums[0]
              this.datumNames = this.datums.map(d => d.datumName)
            }

            dataImportStore.setLoaderParameters({
              showLoader: false,
              showImportView: true
            })
            resolve(response)
          })
          .catch(error => {
            dataImportStore.setLoaderParameters({
              showLoader: false,
              showImportView: true
            })
            reject(error)
          })
      })
    },

    onDatumSelectionChanged(datumName) {
      const selected = this.datums.find(d => d.datumName === datumName)
      if (selected) {
        this.selectedDatum = selected
      }
    },

    clearDatums() {
      this.datums = []
      this.datumNames = []
      this.selectedDatum = {}
    }
  }
})
