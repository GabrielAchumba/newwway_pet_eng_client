import { defineStore } from 'pinia'
import { https } from 'src/httpservices/services'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    statusBar: {
      actionMessage: '',
      visibility: false
    },
    Loginstatus: false,
    IdentityModel: {},
    user: {},
    administrator: {},
    companyName: '',
    companyId: {},
    isLayout1: false,
    isLayout2: true,
    activeViews: {
      isdefaultviewleft: true,
      isdatum: false,
      iswellpath: false,
      ishole: false,
      istubingstring: false,
      isrig: false,
      isfluids: false,
      issubsurface: false,
      isoperations: false
    },
    dockViewWidth: screen.width,
    outputTabs: [],
    outputTabNames: [],
    visible: false,
    showSimulatedReturnData: true,
    showSpinner: false,
    spinnerSize: "8em",
    spinnerThickness: 10,
    isError: false,
    errorMessages: "",
    pageTitle: "",
    workSheetsNames: [],
    workSheetsData: [],
    newRows: [],
    isMobile: false,
  }),

  // getters: {
  //   statusBar: state => state.statusBar,
  //   outputTabNames: state => state.outputTabNames,
  //   outputTabs: state => state.outputTabs,
  //   dockViewWidth: state => state.dockViewWidth,
  //   activeViews: state => state.activeViews,
  //   Loginstatus: state => state.Loginstatus,
  //   IdentityModel: state => state.IdentityModel,
  //   user: state => state.user,
  //   administrator: state => state.administrator,
  //   companyName: state => state.companyName,
  //   companyId: state => state.companyId,
  //   isLayout1: state => state.isLayout1,
  //   isLayout2: state => state.isLayout2
  // },

  actions: {
    setStateData({variableName, variableValue}) {
      this[variableName] = variableValue;
    },

    setStatusMessageBarVisibility({ visibility, actionMessage }) {
      this.statusBar.visibility = visibility
      this.statusBar.actionMessage = actionMessage
    },

    AddOutputTab(payload) {
      const router = useRouter()
      const exists = this.outputTabs.some(tab => tab.name === payload.name)

      if (!exists) {
        this.outputTabs.push({
          name: payload.name,
          isActive: false,
          route: payload.route
        })
        this.outputTabNames.push(payload.name)
      }

      router.push('/' + payload.route)
    },

    RemoveOutputTab(payload) {
      const router = useRouter()
      const index = this.outputTabNames.indexOf(payload.name)
      if (index > -1) {
        this.outputTabNames.splice(index, 1)
        this.outputTabs.splice(index, 1)

        const len = this.outputTabs.length
        const route = len > 0 ? '/' + this.outputTabs[len - 1].route : '/commonPage'
        router.push(route)
      }
    },

    UpdateDockViewWidth() {
      this.dockViewWidth = 900
    },

    SetActiveViews(payload) {
      this.activeViews = payload
    },

    Login(payload) {
      const router = useRouter()
      this.Loginstatus = true
      this.IdentityModel = payload.user
      this.companyName = payload.user.companyName

      const inMin = 24 * 60
      let expiredAt = new Date(new Date().getTime() + 60000 * inMin)
      let obj = {
        value: payload.token,
        expiredAt: expiredAt.toISOString()
      }
      sessionStorage.setItem('seassionObj', JSON.stringify(obj))

      if (payload.token !== undefined) {
        router.push('/userLayout')
        this.visible = false
        this.showSimulatedReturnData = true
      }
    },

    Logout() {
      const router = useRouter()
      this.Loginstatus = false
      this.IdentityModel = {}
      router.push('/')
    },

    showLayout1() {
      const router = useRouter()
      this.isLayout1 = true
      this.isLayout2 = false
      router.push('/docksite')
    },

    async LoginUser(payload) {
      const router = useRouter()
      this.visible = true
      this.showSimulatedReturnData = false

      try {
        const response = await https().post('users/Login', payload)

        this.Login(response.data)

        this.setStatusMessageBarVisibility({
          actionMessage: response.data.info,
          visibility: true
        })

        // Example: calling another store’s action
        const wellDesignStore = useWellDesignStore() // you'll need to import this
        await wellDesignStore.GetTorqueDragDesigns({
          companyName: response.data.user.companyName,
          id: response.data.user._id
        })

        return response
      } catch (error) {
        this.visible = false
        this.showSimulatedReturnData = true
        alert(error.message)
        throw error
      }
    },

    async Login(payload) {
      this.visible = true
      this.showSimulatedReturnData = false

      try {
        const response = await https().post('identities/Login', payload)
        await this.LoginUser(payload)
        return response
      } catch (error) {
        this.visible = false
        this.showSimulatedReturnData = true
        alert(error.message)
        throw error
      }
    },

    async LogoutApi() {
      try {
        const response = await https().post('identities/Logout', this.IdentityModel)
        this.Logout()
        return response
      } catch (error) {
        throw error
      }
    }
  }
})