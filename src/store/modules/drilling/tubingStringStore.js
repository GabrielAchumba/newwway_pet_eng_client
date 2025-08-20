import { https } from 'src/httpservices/services';

const state = {
    pipes:[],
    isImportDialogVisible: false,
    pipe: {},
    drillBit: {
      bitSize: 0,
      numberOfBitNozzles: 0,
      dischargeCoefficient: 0
    },
    pipeDescriptions: {
      length: "Please Enter Length",
      measuredDepth: "Please Enter Measured Depth",
      size: "Please Enter Outer Diameter Size",
      outerDiameter: "Please Enter Outer Diameter",
      innerDiameter: "Please Enter Inner Diameter",
      weight: "Please Enter Inner Weight",
      grade: "Please Enter Grade",
      innminimumYieldStrengtherDiameter: "Please Enter Minimum Yield Strength",
      youngsModulus: "Please Enter Youngs Modulus",
      makeUpTorque: "Please Enter MakeUp Torque",
      overPullMargin: "Please Enter OverPull Margin",
      bitSize: "Please Enter Bit Size",
      numberOfBitNozzles: "Please Enter Number of Nozzles",
      dischargeCoefficient: "Please Enter Discharge Coefficient"
    }
  }


  const getters = {
    pipeDescriptions(){
      return state.pipeDescriptions;
    },
    drillBit(state){
      return state.drillBit;
    },
    pipes(state){
      return state.pipes;
    },
    isImportDialogVisible(state){
      return state.isImportDialogVisible;
    },
    pipe(state){
      return state.pipe;
    }
}

const mutations = {
  PostPipe(state, payload){
    state.pipe = payload;
  },
  PostPipes(state){
    state.isImportDialogVisible = false;
  },
  GetPipes(state, payload){
    state.pipes = payload;
  },
  GetDrillBit(state, payload){
    var keys = Object.keys(payload);
    console.log(keys);
    if(keys.length > 0){
      state.drillBit = payload;
    }
    
  },
  SetisImportDialogVisible(state, payload){
    state.isImportDialogVisible = payload;
  },
  SaveTubingStringTable(state, payload){
    state.pipes.push(payload);
    console.log("pipes: ", state.pipes)
  },
  ClearPipes(state){
    state.pipes = [];
  },
  ClearDrillBit(state){
    state.drillBit = {
      bitSize: 0,
      numberOfBitNozzles: 0,
      dischargeCoefficient: 0
    }
  }

}

const actions = {
  PostPipes(context, payload)
  {

    let config = {
      headers: {
        tenantcode: payload.companyName,
      },
      useCredentails: true
    }

    //state.pipes = [];
    //state.pipes = payload.pipes;
    console.log('payload: ', payload);

    return new Promise((resolve, reject) => {
  

       https().post('Pipes/PostPipes', payload)
        .then(response => {
            
          context.commit('PostPipes', response.data)  
          context.commit('dataImportStore/SetLoaderParameters', {
            showLoader: false,
            showImportView: true
          }, {root:true});
          context.commit('authStore/setStatusMessageBarVisibility',  
          {
            actionMessage: "Tubing strings saved successfully",
            visibility: true
          }, {root:true});    

            resolve(response)
            
        })
        .catch(error => {
          console.log("PostPipes error")
          context.commit('dataImportStore/SetLoaderParameters', {
            showLoader: false,
            showImportView: true
          }, {root:true});
          context.commit('authStore/setStatusMessageBarVisibility',  
          {
            actionMessage: "Tubing strings failed to save. Please check your data",
            visibility: true
          }, {root:true});    
          reject(error)
        })
    })
  },
  PostDrillBit(context, payload)
  {

    let config = {
      headers: {
        tenantcode: payload.companyName,
      },
      useCredentails: true
    }

    //state.drillBit = {};
    //state.drillBit = payload.drillBit;
    console.log('payload: ', payload);

    /* payload.bitSize = parseFloat(payload.bitSize);
    payload.numberOfBitNozzles = parseFloat(payload.numberOfBitNozzles);
    payload.dischargeCoefficient = parseFloat(payload.dischargeCoefficient);
    payload.designId = payload.designId;
    payload.userId = payload.userId; */

    return new Promise((resolve, reject) => {
  

       https().post('DrillBits/PostDrillBit', payload, config)
        .then(response => {
            
          //context.commit('PostDrillBit', response.data)  
          context.commit('dataImportStore/SetLoaderParameters', {
            showLoader: false,
            showImportView: true
          }, {root:true});
          context.commit('authStore/setStatusMessageBarVisibility',  
          {
            actionMessage: "Drill bit saved successfully",
            visibility: true
          }, {root:true});    

            resolve(response)
            
        })
        .catch(error => {
          console.log("PostDrillBit error")
          context.commit('dataImportStore/SetLoaderParameters', {
            showLoader: false,
            showImportView: true
          }, {root:true});
          context.commit('authStore/setStatusMessageBarVisibility',  
          {
            actionMessage: "Drill bit failed to save. Please check your data",
            visibility: true
          }, {root:true});    
          reject(error)
        })
    })
  },
  PostPipe(context, payload)
  {


    let config = {
      headers: {
        tenantcode: payload.companyName,
      },
      useCredentails: true
    }
    return new Promise((resolve, reject) => {
  

       https().post('Pipes/PostPipe', payload, config)
        .then(response => {
            
          context.commit('PostPipe', response.data)  

            resolve(response)
            
        })
        .catch(error => {
          console.log("PostPipe error")
          reject(error)
        })
    })
  },
  GetPipes(context, payload)
  {

    context.commit('dataImportStore/SetLoaderParameters', {
      showLoader: true,
      showImportView: false
    }, {root:true});
    let config = {
      headers: {
        tenantcode: payload.companyName,
      },
      useCredentails: true
    }
   
    context.commit("ClearPipes")

    //var ids = payload.designId.toString() + "&" + payload.userId.toString();

    return new Promise((resolve, reject) => {
  

       https().get('Pipes/GetPipes/' + payload.designId)
        .then(response => {
          console.log('drillpipe response: ', response);
          context.commit('GetPipes', response.data)  
          context.commit('dataImportStore/SetLoaderParameters', {
            showLoader: false,
            showImportView: true
          }, {root:true});            
            resolve(response)
            
        })
        .catch(error => {
          console.log("GetPipes error")
          context.commit('dataImportStore/SetLoaderParameters', {
            showLoader: false,
            showImportView: true
          }, {root:true});
          reject(error)
        })
    })
  },
  GetDrillBit(context, payload)
  {
  
    context.commit('dataImportStore/SetLoaderParameters', {
      showLoader: true,
      showImportView: false
    }, {root:true});
    let config = {
      headers: {
        tenantcode: payload.companyName,
      },
      useCredentails: true
    }

    context.commit("ClearDrillBit")

   // var ids = payload.designId.toString() + "&" + payload.userId.toString();

    return new Promise((resolve, reject) => {
  

       https().get('DrillBits/GetDrillBit/' + payload.designId)
        .then(response => {
            console.log('drillbit response: ', response);
          context.commit('GetDrillBit', response.data)  
          context.commit('dataImportStore/SetLoaderParameters', {
            showLoader: false,
            showImportView: true
          }, {root:true});            
            resolve(response)
            
        })
        .catch(error => {
          console.log("GetDrillBit error")
          context.commit('dataImportStore/SetLoaderParameters', {
            showLoader: false,
            showImportView: true
          }, {root:true});
          reject(error)
        })
    })
  },
  ClearPipes(context, payload){
    context.commit('ClearPipes');
  },
  ClearDrillBit(context, payload){
    context.commit('ClearDrillBit');
  }


}

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state
}