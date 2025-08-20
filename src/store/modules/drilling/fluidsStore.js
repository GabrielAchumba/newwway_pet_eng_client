import { defineStore } from 'pinia'
import { https } from 'src/httpservices/services'
import { useDataImportStore } from './dataImportStore'
import { useAuthStore } from '../authStore'

export const useFluidsStore = defineStore('fluids', {
  state: () => ({
    mudPVTs: [],
    fluid: {
      mudName: "",
      description: "",
      mudBaseType: "",
      baseFluid: "",
      rheologyModel: "",
      rheologyModelType: "",
      baseFannDialReading: "70",
      baseFannRPM: "300",
      fannDialReading: "130",
      fannRPM: "60"
    },
    fluidDescription: {
      mudName: "Please Enter Mud Name",
      description: "Please Enter Description",
      mudBaseType: "Please Enter Mud Base Type",
      baseFluid: "Please Enter Base Fluid",
      rheologyModel: "Please Enter Rheology Model",
      rheologyModelType: "Please Enter Rheology Model Type",
      baseFannDialReading: "Please Enter Base Fann Dial Reading",
      baseFannRPM: "Please Enter Base Fann RPM",
      fannDialReading: "Please Enter Fann Reading",
      fannRPM: "Please Enter Fann RPM",
      yieldPoint: "Please Enter Yield Point",
      reference: "Please Enter Reference",
      plasticViscoity: "Please Enter Plastic Viscoity",
      density: "Please Enter Density",
      pressure: "Please Enter Pressure",
      temperature: "Please Enter Temperature"
    },
    isImportDialogVisible: false,
    rheologyOne: "",
    rheologyTwo: ""
  }),

  getters: {
    fluidDescription: (state) => state.fluidDescription,
    mudPVTs: (state) => state.mudPVTs,
    fluid: (state) => state.fluid,
    isImportDialogVisible: (state) => state.isImportDialogVisible
  },

  actions: {
    GetFluid(payload) {
      const dataImportStore = useDataImportStore()
      dataImportStore.SetLoaderParameters({
        showLoader: true,
        showImportView: false
      })

      const config = {
        headers: {
          tenantcode: payload.companyName,
        },
        useCredentails: true
      }

      return new Promise((resolve, reject) => {
        https().get('Fluids/GetFluid/' + payload.designId)
          .then(response => {
            this.fluid = response.data
            this.rheologyOne = ""
            this.rheologyTwo = ""
            
            if (this.fluid.rheologyModelType == "Rheology") {
              this.rheologyOne = this.fluid.rheologyModelType
            } else {
              this.rheologyTwo = this.fluid.rheologyModelType
            }

            dataImportStore.SetLoaderParameters({
              showLoader: false,
              showImportView: true
            })
            resolve(response)
          })
          .catch(error => {
            console.log("GetFluid error")
            dataImportStore.SetLoaderParameters({
              showLoader: false,
              showImportView: true
            })
            reject(error)
          })
      })
    },

    GetMudPVTs(payload) {
      const dataImportStore = useDataImportStore()
      dataImportStore.SetLoaderParameters({
        showLoader: true,
        showImportView: false
      })

      const config = {
        headers: {
          tenantcode: payload.companyName,
        },
        useCredentails: true
      }

      return new Promise((resolve, reject) => {
        https().get('MudPVTs/GetMudPVTs/' + payload.designId)
          .then(response => {
            this.mudPVTs = response.data
            dataImportStore.SetLoaderParameters({
              showLoader: false,
              showImportView: true
            })
            resolve(response)
          })
          .catch(error => {
            console.log("GetMudPVTs error")
            dataImportStore.SetLoaderParameters({
              showLoader: false,
              showImportView: true
            })
            reject(error)
          })
      })
    },

    PostFluid(payload) {
      const dataImportStore = useDataImportStore()
      const authStore = useAuthStore()

      const config = {
        headers: {
          tenantcode: payload.companyName,
        },
        useCredentails: true
      }

      return new Promise((resolve, reject) => {
        https().post('Fluids/PostFluid', payload)
          .then(response => {
            this.fluid = response.data
            dataImportStore.SetLoaderParameters({
              showLoader: false,
              showImportView: true
            })
            authStore.setStatusMessageBarVisibility({
              actionMessage: "Fluid parameters saved successfully",
              visibility: true
            })
            resolve(response)
          })
          .catch(error => {
            console.log("PostFluid error")
            dataImportStore.SetLoaderParameters({
              showLoader: false,
              showImportView: true
            })
            reject(error)
          })
      })
    },

    PostMudPVTs(payload) {
      const dataImportStore = useDataImportStore()
      const authStore = useAuthStore()

      const config = {
        headers: {
          tenantcode: payload.companyName,
        },
        useCredentails: true
      }

      this.mudPVTs = payload.mudPVTs

      return new Promise((resolve, reject) => {
        https().post('MudPVTs/PostMudPVTs', payload)
          .then(response => {
            this.isImportDialogVisible = false
            dataImportStore.SetLoaderParameters({
              showLoader: false,
              showImportView: true
            })
            authStore.setStatusMessageBarVisibility({
              actionMessage: "Fluid PVT table saved successfully",
              visibility: true
            })
            resolve(response)
          })
          .catch(error => {
            console.log("PostMudPVTs error")
            dataImportStore.SetLoaderParameters({
              showLoader: false,
              showImportView: true
            })
            reject(error)
          })
      })
    },

    SavePVTRecord(payload) {
      this.mudPVTs.push(payload)
      console.log("mudPVTs: ", this.mudPVTs)
    },

    ClearMudPVTs() {
      this.mudPVTs = []
    },

    ClearFluid() {
      this.fluid = {
        mudName: "",
        description: "",
        mudBaseType: "",
        baseFluid: "",
        rheologyModel: "",
        rheologyModelType: "",
        baseFannDialReading: "70",
        baseFannRPM: "300",
        fannDialReading: "130",
        fannRPM: "60"
      }
    },

    SetisImportDialogVisible(payload) {
      this.isImportDialogVisible = payload
    }
  }
})