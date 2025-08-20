import { defineStore } from 'pinia'
import { https } from 'src/httpservices/services'
import { useDataImportStore } from './dataImportStore'
import { useAuthStore } from '../authStore'

export const useWellDesignStore = defineStore('wellDesign', {
  state: () => ({
    siteNames: [],
    externalcompanyNames: [],
    torqueDragDesign: {},
    torqueDragDesigns: [],
    SelectedTorqueDragDesign: {},
    projectNames: [],
    fieldNames: [],
    wellNames: [],
    wellboreNames: [],
    wellDesignNames: [],
    wellCases: [],
    wellProjects: [],
    selected: null,
    isCreateWellDesign: false,
    isWellExplorer: false,
    caption: "DP Well Engineering",
    torqueDragMostRecentDesigns: []
  }),

  // getters: {
  //   torqueDragMostRecentDesigns: (state) => state.torqueDragMostRecentDesigns,
  //   caption: (state) => state.caption,
  //   externalcompanyNames: (state) => state.externalcompanyNames,
  //   siteNames: (state) => state.siteNames,
  //   isWellExplorer: (state) => state.isWellExplorer,
  //   torqueDragDesign: (state) => state.torqueDragDesign,
  //   torqueDragDesigns: (state) => state.torqueDragDesigns,
  //   SelectedTorqueDragDesign: (state) => state.SelectedTorqueDragDesign,
  //   projectNames: (state) => state.projectNames,
  //   fieldNames: (state) => state.fieldNames,
  //   wellNames: (state) => state.wellNames,
  //   wellboreNames: (state) => state.wellboreNames,
  //   wellDesignNames: (state) => state.wellDesignNames,
  //   wellProjects: (state) => state.wellProjects,
  //   wellCases: (state) => state.wellCases,
  //   isCreateWellDesign: (state) => state.isCreateWellDesign
  // },

  actions: {
    SetIsWellExplorer(payload) {
      this.isWellExplorer = payload
    },

    SetCreateWellDesign(payload) {
      this.isCreateWellDesign = payload
    },

    async PostTorqueDragDesign(payload) {
      const dataImportStore = useDataImportStore()
      const authStore = useAuthStore()

      const config = {
        headers: {
          tenantcode: payload.companyName,
        },
        useCredentails: true
      }

      try {
        const response = await https().post('torqueDragDesigns/PostTorqueDragDesign', payload, config)
        
        this.torqueDragDesign = response.data.torqueDragDesign
        this.caption = `DP Well Engineering (${payload.designName})`
        
        if (response.data.info === "No well data") {
          alert("No well data")
        } else if (response.data.info === "Well case already exists") {
          alert("Well case already exists")
        }

        this.isCreateWellDesign = false
        
        // Refresh designs list
        await this.GetTorqueDragDesigns({
          companyName: payload.companyName,
          id: payload.torqueDragDesign.userId
        })

        dataImportStore.SetLoaderParameters({
          showLoader: false,
          showImportView: true
        })
        
        authStore.setStatusMessageBarVisibility({
          actionMessage: response.data.info,
          visibility: true
        })

        return response
      } catch (error) {
        dataImportStore.SetLoaderParameters({
          showLoader: false,
          showImportView: true
        })
        
        authStore.setStatusMessageBarVisibility({
          actionMessage: `Error encountered during saving ${payload.designName}`,
          visibility: true
        })
        
        this.caption = `DP Well Engineering (${payload.designName})`
        console.log("PostTorqueDragDesign error", error)
        throw error
      }
    },

    async PostSelectedWellDesign(payload) {
      const dataImportStore = useDataImportStore()
      const authStore = useAuthStore()

      const config = {
        headers: {
          tenantcode: payload.companyName,
        },
        useCredentails: true
      }

      // Find and set selected design
      const foundDesign = this.torqueDragDesigns.find(
        design => design.wellCaseId === payload.wellCaseId
      )
      if (foundDesign) {
        this.SelectedTorqueDragDesign = foundDesign
      }

      try {
        const response = await https().post('torqueDragDesigns/PostSelectedWellDesign', {
          wellCaseId: payload.wellCaseId,
          torqueDragDesigns: this.torqueDragDesigns
        }, config)

        this.SelectedTorqueDragDesign = response.data
        this.caption = `DP Well Engineering (${response.data.designName})`

        const payload2 = {
          companyName: payload.companyName,
          designId: this.SelectedTorqueDragDesign.id,
          userId: this.SelectedTorqueDragDesign.userId
        }

        // Load all related data
        await Promise.all([
          this.$router.app.$store.dispatch('datumStore/GetDatums', payload2),
          this.$router.app.$store.dispatch('fluidsStore/GetFluid', payload2),
          this.$router.app.$store.dispatch('holeStore/GetHoleSections', payload2),
          this.$router.app.$store.dispatch('operationsStore/GetOperation', payload2),
          this.$router.app.$store.dispatch('settingsStore/GetCommon', payload2),
          this.$router.app.$store.dispatch('tubingStringStore/GetPipes', payload2),
          this.$router.app.$store.dispatch('wellPathStore/GetDeviationSurveys', payload2),
          this.$router.app.$store.dispatch('tubingStringStore/GetDrillBit', payload2),
          this.$router.app.$store.dispatch('rigStore/GetRig', payload2)
        ])

        dataImportStore.SetLoaderParameters({
          showLoader: false,
          showImportView: true
        })
        
        authStore.setStatusMessageBarVisibility({
          actionMessage: `${response.data.designName} selected`,
          visibility: true
        })

        return response
      } catch (error) {
        dataImportStore.SetLoaderParameters({
          showLoader: false,
          showImportView: true
        })
        console.log("PostSelectedWellDesign error", error)
        throw error
      }
    },

    async GetTorqueDragDesigns(payload) {
      const config = {
        headers: {
          tenantcode: payload.companyName,
        },
        useCredentails: true
      }

      try {
        const response = await https().get(`torqueDragDesigns/GetWellDesignsByUserId/${payload.id}`, config)
        
        this.wellProjects = response.data.Companies
        this.torqueDragDesigns = response.data.torqueDragDesigns
        this.torqueDragMostRecentDesigns = response.data.torqueDragMostRecentDesigns
        this.SelectedTorqueDragDesign = this.torqueDragDesigns[0] || {}
        
        this.GetListsofData()
        
        return response
      } catch (error) {
        console.log("GetTorqueDragDesigns error", error)
        throw error
      }
    },

    async DeleteTorqueDragDesign(payload) {
      const authStore = useAuthStore()
      const config = {
        headers: {
          tenantcode: payload.companyName,
        },
        useCredentails: true
      }

      try {
        const response = await https().get(`torqueDragDesigns/DeleteTorqueDragDesign/${payload.uniqueId}`, config)
        
        authStore.setStatusMessageBarVisibility({
          actionMessage: response.info,
          visibility: true
        })

        return response
      } catch (error) {
        console.log("DeleteTorqueDragDesign error", error)
        throw error
      }
    },

    async GetSelectedTorqueDragDesign(payload) {
      const authStore = useAuthStore()
      
      this.SelectedTorqueDragDesign = payload.SelectedTorqueDragDesign
      
      // Update selection status
      this.torqueDragMostRecentDesigns = this.torqueDragMostRecentDesigns.map(design => ({
        ...design,
        isSelected: design.uniqueId === this.SelectedTorqueDragDesign.uniqueId
      }))

      this.caption = `DP Well Engineering (${this.SelectedTorqueDragDesign.designName})`

      const payload2 = {
        companyName: payload.companyName,
        designId: payload.designId,
        userId: payload.userId
      }

      // Clear all related stores first
      await Promise.all([
        this.$router.app.$store.dispatch('simulationStore/ClearSimulationStore'),
        this.$router.app.$store.dispatch('datumStore/ClearDatums'),
        this.$router.app.$store.dispatch('wellPathStore/ClearDeviationSurveys'),
        this.$router.app.$store.dispatch('holeStore/ClearHoleSections'),
        this.$router.app.$store.dispatch('tubingStringStore/ClearPipes'),
        this.$router.app.$store.dispatch('tubingStringStore/ClearDrillBit'),
        this.$router.app.$store.dispatch('rigStore/ClearRig'),
        this.$router.app.$store.dispatch('operationsStore/ClearOperation'),
        this.$router.app.$store.dispatch('fluidsStore/ClearFluid'),
        this.$router.app.$store.dispatch('fluidsStore/ClearMudPVTs'),
        this.$router.app.$store.dispatch('settingsStore/clearAnalysisSettings')
      ])

      // Load all related data
      await Promise.all([
        this.$router.app.$store.dispatch('datumStore/GetDatums', payload2),
        this.$router.app.$store.dispatch('wellPathStore/GetDeviationSurveys', payload2),
        this.$router.app.$store.dispatch('holeStore/GetHoleSections', payload2),
        this.$router.app.$store.dispatch('tubingStringStore/GetPipes', payload2),
        this.$router.app.$store.dispatch('tubingStringStore/GetDrillBit', payload2),
        this.$router.app.$store.dispatch('rigStore/GetRig', payload2),
        this.$router.app.$store.dispatch('operationsStore/GetOperation', payload2),
        this.$router.app.$store.dispatch('fluidsStore/GetFluid', payload2),
        this.$router.app.$store.dispatch('fluidsStore/GetMudPVTs', payload),
        this.$router.app.$store.dispatch('settingsStore/GetCommon', payload2),
        this.$router.app.$store.dispatch('simulationStore/GetSensitivityParameters', payload2)
      ])

      authStore.setStatusMessageBarVisibility({
        actionMessage: `${this.SelectedTorqueDragDesign.designName} selected`,
        visibility: true
      })
    },

    async PostAllData(payload) {
      await Promise.all([
        this.$router.app.$store.dispatch('datumStore/PostDatum', {
          companyName: payload.companyName,
          designId: payload.designId,
          userId: payload.userId,
          datum: payload.allInputsDTO.datum
        }),
        this.$router.app.$store.dispatch('fluidsStore/PostFluid', {
          companyName: payload.companyName,
          designId: payload.designId,
          userId: payload.userId,
          fluid: payload.allInputsDTO.fluid
        }),
        this.$router.app.$store.dispatch('holeStore/PostHoleSections', {
          companyName: payload.companyName,
          designId: payload.designId,
          userId: payload.userId,
          holeSections: payload.allInputsDTO.holeSections
        }),
        this.$router.app.$store.dispatch('operationsStore/PostOperation', {
          companyName: payload.companyName,
          designId: payload.designId,
          userId: payload.userId,
          operation: payload.allInputsDTO.operation
        }),
        this.$router.app.$store.dispatch('settingsStore/PostCommon', {
          companyName: payload.companyName,
          designId: payload.designId,
          userId: payload.userId,
          common: payload.allInputsDTO.common
        }),
        this.$router.app.$store.dispatch('tubingStringStore/PostPipes', {
          companyName: payload.companyName,
          designId: payload.designId,
          userId: payload.userId,
          pipes: payload.allInputsDTO.pipes
        }),
        this.$router.app.$store.dispatch('wellPathStore/PostDeviationSurvey', {
          companyName: payload.companyName,
          designId: payload.designId,
          userId: payload.userId,
          deviationSurveys: payload.allInputsDTO.deviationSurveys
        }),
        this.$router.app.$store.dispatch('tubingStringStore/PostDrillBit', {
          companyName: payload.companyName,
          designId: payload.designId,
          userId: payload.userId,
          drillBit: payload.allInputsDTO.drillBit
        }),
        this.$router.app.$store.dispatch('rigStore/PostRig', {
          companyName: payload.companyName,
          designId: payload.designId,
          userId: payload.userId,
          rig: payload.allInputsDTO.rig
        })
      ])
    },

    GetListsofData() {
      if (this.SelectedTorqueDragDesign && Object.keys(this.SelectedTorqueDragDesign).length === 0) {
        if (this.torqueDragDesigns.length > 0) {
          this.SelectedTorqueDragDesign = this.torqueDragDesigns[0]
        }
      }

      if (this.SelectedTorqueDragDesign && Object.keys(this.SelectedTorqueDragDesign).length > 0 && 
          this.wellProjects && this.wellProjects.length > 0) {
        
        const wellProject = this.wellProjects[0]
        const field = wellProject.children[0]
        const well = field.children[0]
        const wellbore = well.children[0]

        this.projectNames = wellProject.children.map(row => row.label)
        this.fieldNames = field.children.map(row => row.label)
        this.wellNames = well.children.map(row => row.label)
        this.wellboreNames = wellbore.children.map(row => row.label)
      }
    },

    GetListsofProjectName(payload) {
      this.projectNames = []
      this.fieldNames = []
      this.wellNames = []
      this.wellboreNames = []
      this.wellDesignNames = []
      this.wellCases = []

      const wellProject = this.wellProjects.find(proj => proj.label === payload)
      if (wellProject) {
        this.fieldNames = wellProject.children.map(child => child.label)
      }
    }
  }
})