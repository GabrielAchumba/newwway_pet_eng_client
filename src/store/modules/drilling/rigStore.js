import { defineStore } from 'pinia'
import { https } from 'src/httpservices/services'
import { useDataImportStore } from './dataImportStore'
import { useAuthStore } from '../authStore'

export const useRigStore = defineStore('rig', {
  state: () => ({
    rig: {
      highPumpPressure: null,
      lowPumpPressure: null,
      flowRateHighPumpPressure: null,
      flowRateLowPumpPressure: null,
      flowExponent: 1.75,
      pumpEfficiency: null,
      maxAllowableSurfacePressure: null,
      maxHorsePower: null,
      minimumFlowRate: null,
      surfaceSystemConstant: null
    },
    bitLosses: {
      nozzleArea: 0,
      lowPressureDropThroughBit: 0,
      highPressureDropThroughBit: 0
    },
    isBitPressureLossesCorrect: false,
    flowExponentMessage: "",
    rigDescriptions: {
      highPumpPressure: "Please Enter High Pump Pressure",
      lowPumpPressure: "Please Enter Low Pump Pressure",
      flowRateHighPumpPressure: "Please Enter Flow Rate for High Pump Pressure",
      flowRateLowPumpPressure: "Please Enter Flow Rate for Low Pump Pressure",
      flowExponent: "Please Enter Flow Exponent",
      pumpEfficiency: "Please Enter Pump Efficiency",
      maxAllowableSurfacePressure: "Please Enter Max. Allowable Surface Pressure",
      maxHorsePower: "Please Enter Max Horse Power",
      minimumFlowRate: "Please Enter Minimum Flow Rate",
      surfaceSystemConstant: "Please Enter Surface System Constant",
    }
  }),

  getters: {
    rigDescriptions: (state) => state.rigDescriptions,
    flowExponentMessage: (state) => state.flowExponentMessage,
    isBitPressureLossesCorrect: (state) => state.isBitPressureLossesCorrect,
    bitLosses: (state) => state.bitLosses,
    rig: (state) => state.rig
  },

  actions: {
    async GetRig(payload) {
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

      this.ClearRig()

      try {
        const response = await https().get('Rigs/GetRig/' + payload.designId, config)
        if (Object.keys(response.data).length > 0) {
          this.rig = response.data
        }
        dataImportStore.SetLoaderParameters({
          showLoader: false,
          showImportView: true
        })
        return response
      } catch (error) {
        console.log("GetRig error")
        dataImportStore.SetLoaderParameters({
          showLoader: false,
          showImportView: true
        })
        throw error
      }
    },

    async PostRig(payload) {
      const dataImportStore = useDataImportStore()
      const authStore = useAuthStore()

      const config = {
        headers: {
          tenantcode: payload.companyName,
        },
        useCredentails: true
      }

      const newPayload = {
        companyName: payload.companyName,
        designId: payload.designId,
        userId: payload.userId,
        highPumpPressure: parseFloat(this.rig.highPumpPressure),
        lowPumpPressure: parseFloat(this.rig.lowPumpPressure),
        flowRateHighPumpPressure: parseFloat(this.rig.flowRateHighPumpPressure),
        flowRateLowPumpPressure: parseFloat(this.rig.flowRateLowPumpPressure),
        flowExponent: parseFloat(this.rig.flowExponent),
        pumpEfficiency: parseFloat(this.rig.pumpEfficiency),
        maxAllowableSurfacePressure: parseFloat(this.rig.maxAllowableSurfacePressure),
        maxHorsePower: parseFloat(this.rig.maxHorsePower),
        minimumFlowRate: parseFloat(this.rig.minimumFlowRate),
        surfaceSystemConstant: parseFloat(this.rig.surfaceSystemConstant)
      }

      try {
        const response = await https().post('Rigs/PostRig', newPayload, config)
        dataImportStore.SetLoaderParameters({
          showLoader: false,
          showImportView: true
        })
        authStore.setStatusMessageBarVisibility({
          actionMessage: "Rig data saved successfully",
          visibility: true
        })
        return response
      } catch (error) {
        dataImportStore.SetLoaderParameters({
          showLoader: false,
          showImportView: true
        })
        authStore.setStatusMessageBarVisibility({
          actionMessage: "Failed to save rig data",
          visibility: true
        })
        console.log("PostRig error")
        throw error
      }
    },

    async calculateFlowExponent(payload) {
      const dataImportStore = useDataImportStore()
      const authStore = useAuthStore()

      const config = {
        headers: {
          tenantcode: payload.companyName,
        },
        useCredentails: true
      }

      // Parse all rig values to floats
      Object.keys(this.rig).forEach(key => {
        if (this.rig[key] !== null) {
          this.rig[key] = parseFloat(this.rig[key])
        }
      })

      const newPayload = {
        companyName: payload.companyName,
        designId: payload.designId,
        userId: payload.userId,
        rig: this.rig
      }

      try {
        const response = await https().post('Commons/calculateFlowExponent', newPayload, config)
        this.rig.flowExponent = response.data.flowExponent
        dataImportStore.SetLoaderParameters({
          showLoader: false,
          showImportView: true
        })
        authStore.setStatusMessageBarVisibility({
          actionMessage: "Flow exponent estimated successfully",
          visibility: true
        })
        return response
      } catch (error) {
        dataImportStore.SetLoaderParameters({
          showLoader: false,
          showImportView: true
        })
        authStore.setStatusMessageBarVisibility({
          actionMessage: "Flow exponent estimation failed",
          visibility: true
        })
        console.log("calculateFlowExponent error: ", error)
        throw error
      }
    },

    async calculatePressureLosses(payload) {
      const dataImportStore = useDataImportStore()
      const authStore = useAuthStore()

      const config = {
        headers: {
          tenantcode: payload.companyName,
        },
        useCredentails: true
      }

      // Parse all rig values to floats
      Object.keys(this.rig).forEach(key => {
        if (this.rig[key] !== null) {
          this.rig[key] = parseFloat(this.rig[key])
        }
      })

      const newPayload = {
        companyName: payload.companyName,
        designId: payload.designId,
        userId: payload.userId,
        rig: this.rig
      }

      try {
        const response = await https().post('Commons/calculatePressureLosses', newPayload, config)
        this.bitLosses = {
          nozzleArea: response.data.nozzleArea,
          lowPressureDropThroughBit: response.data.lowPressureDropThroughBit,
          highPressureDropThroughBit: response.data.highPressureDropThroughBit
        }

        this.isBitPressureLossesCorrect = !(
          this.rig.highPumpPressure < this.bitLosses.highPressureDropThroughBit ||
          this.rig.lowPumpPressure < this.bitLosses.lowPressureDropThroughBit
        )

        this.flowExponentMessage = this.isBitPressureLossesCorrect
          ? "Flow exponent is correct. Click calculate to see result"
          : "Flow exponent is not a number. Check your input"

        dataImportStore.SetLoaderParameters({
          showLoader: false,
          showImportView: true
        })
        authStore.setStatusMessageBarVisibility({
          actionMessage: "Bit pressure losses estimated successfully",
          visibility: true
        })
        return response
      } catch (error) {
        dataImportStore.SetLoaderParameters({
          showLoader: false,
          showImportView: true
        })
        authStore.setStatusMessageBarVisibility({
          actionMessage: "Bit pressure losses estimation failed",
          visibility: true
        })
        console.log("calculatePressureLosses error: ", error)
        throw error
      }
    },

    ClearRig() {
      this.rig = {
        highPumpPressure: null,
        lowPumpPressure: null,
        flowRateHighPumpPressure: null,
        flowRateLowPumpPressure: null,
        flowExponent: 1.75,
        pumpEfficiency: null,
        maxAllowableSurfacePressure: null,
        maxHorsePower: null,
        minimumFlowRate: null,
        surfaceSystemConstant: null
      }
    }
  }
})