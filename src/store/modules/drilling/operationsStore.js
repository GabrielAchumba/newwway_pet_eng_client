import { defineStore } from 'pinia'
import { https } from 'src/httpservices/services'
import { useDataImportStore } from './dataImportStore'
import { useAuthStore } from '../authStore'

export const useOperationsStore = defineStore('operations', {
  state: () => ({
    operation: {
      isTrippingInChecked: false,
      trippingInSpeed: 0,
      trippingInRPM: 0,
      isTrippingOutChecked: false,
      trippingOutSpeed: 0,
      trippingOutRPM: 0,
      isRotatingOnBottomChecked: false,
      isSlideDrillingChecked: false,
      weightOnBit: 0,
      torqueAtBit: 0,
      isBackReamingChecked: false,
      isRotatingOffBottomChecked: false,
      isUserDefinedOperationsChecked: false,
      isHookLoad: false,
      isWeightOnBit: false,
      isIDHMTrippingInChecked: false,
      weightOnBitIDHM: 0,
      hookLoadIDHM: 0,
      isIDHMTrippingOutChecked: false,
      isIDHMRotatingChecked: false,
      tripSpeedBackReam: 0,
      tripRPMBackReam: 0,
      torqueAtBitDrillingOperation: 0,
      torqueAtBitBackReaming: 0,
      overpullBackReaming: 0
    },
    operationDescriptions: {
      trippingInSpeed: "Please Enter Tripping In Speed",
      trippingInRPM: "Please Enter Tripping In RPM",
      trippingOutSpeed: "Please Enter Tripping Out Speed",
      trippingOutRPM: "Please Enter Tripping Out RPM",
      weightOnBit: "Please Enter Weight On Bit",
      torqueAtBit: "Please Enter Torque At Bit",
      weightOnBitIDHM: "Please Enter Weight On Bit",
      hookLoadIDHM: "Please Enter Hooke Load",
      tripSpeedBackReam: "Please Enter Tripping Speed",
      tripRPMBackReam: "Please Enter Tripping RPM",
      torqueAtBitDrillingOperation: "Please Enter Torque At Bit",
      torqueAtBitBackReaming: "Please Enter Torque At Bit",
      overpullBackReaming: "Please Enter Over Pull",
    },
    operationNames: [
      "No Operation", 
      "Tripping In", 
      "Tripping Out", 
      "Rotating On Bottom",
      "Slide Drilling", 
      "Back reaming", 
      "Rotating Off Bottom"
    ]
  }),

  getters: {
    operationDescriptions: (state) => state.operationDescriptions,
    operation: (state) => state.operation,
    operationNames: (state) => state.operationNames
  },

  actions: {
    async GetOperation(payload) {
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

      try {
        const response = await https().get('Operations/GetOperation/' + payload.designId, config)
        this.operation = response.data
        dataImportStore.SetLoaderParameters({
          showLoader: false,
          showImportView: true
        })
        return response
      } catch (error) {
        console.log("GetOperation error")
        dataImportStore.SetLoaderParameters({
          showLoader: false,
          showImportView: true
        })
        throw error
      }
    },

    async PostOperation(payload) {
      const dataImportStore = useDataImportStore()
      const authStore = useAuthStore()

      const config = {
        headers: {
          tenantcode: payload.companyName,
        },
        useCredentails: true
      }

      // Add userId and designId to operation payload
      const operationPayload = {
        ...payload.operation,
        userId: payload.userId,
        designId: payload.designId
      }

      try {
        const response = await https().post('Operations/PostOperation', operationPayload, config)
        this.operation = response.data
        dataImportStore.SetLoaderParameters({
          showLoader: false,
          showImportView: true
        })
        authStore.setStatusMessageBarVisibility({
          actionMessage: "Operation parameters saved successfully",
          visibility: true
        })
        return response
      } catch (error) {
        console.log("PostOperation error")
        dataImportStore.SetLoaderParameters({
          showLoader: false,
          showImportView: true
        })
        authStore.setStatusMessageBarVisibility({
          actionMessage: "Operation parameters failed to save. Please check your data",
          visibility: true
        })
        throw error
      }
    },

    ClearOperation() {
      this.operation = {
        isTrippingInChecked: false,
        trippingInSpeed: 0,
        trippingInRPM: 0,
        isTrippingOutChecked: false,
        trippingOutSpeed: 0,
        trippingOutRPM: 0,
        isRotatingOnBottomChecked: false,
        isSlideDrillingChecked: false,
        weightOnBit: 0,
        torqueAtBit: 0,
        isBackReamingChecked: false,
        isRotatingOffBottomChecked: false,
        isUserDefinedOperationsChecked: false,
        isHookLoad: false,
        isWeightOnBit: false,
        isIDHMTrippingInChecked: false,
        weightOnBitIDHM: 0,
        hookLoadIDHM: 0,
        isIDHMTrippingOutChecked: false,
        isIDHMRotatingChecked: false,
        tripSpeedBackReam: 0,
        tripRPMBackReam: 0,
        torqueAtBitDrillingOperation: 0,
        torqueAtBitBackReaming: 0,
        overpullBackReaming: 0
      }
    }
  }
})