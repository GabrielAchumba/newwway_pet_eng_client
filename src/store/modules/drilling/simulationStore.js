import { https } from 'src/httpservices/services';
import { convertToNumber } from 'boot/utils'

const state = {
  customTable: [],
  customColumns: [],
  excelFileName: "results.csv",
  tableTitle: "",
  modulesParams: {
    torqueAndDrag: true,
    hydraulics: false,
    surgeAndSwab: false
  },
  isRunning: true,
  trippingInResults: [],
  trippingOutResults: [],
  drillingResults: [],
  slideDrillingResults: [],
  backReamingResults: [],
  rotatingOffBottomResults: [],
  hydraulicsResults: [],
  surgeSwabResults: [],
    visible: false,
    showSimulatedReturnData: true,
    schematicDTO: {},
    holeSegmentLast:{},
    xMax: 1000.0,
    yMax: 1000.0,
    segmentPipeList: [],
    holeSegmentLabels: [],
    tubingSegmentLabels: [],
    sensitivityColumns: [
        { name: "sensitivity1", label: "Sensitivity 1", field: "", align: "left" }
    ],
    sensitivity: {
      name: "Sensitivity 1",
      typesOfHole: [ 
        {
          hole: "Casing",
          holeValues: [null, null, null, null, null]

        },
        {
          hole: "Open Hole",
          holeValues: [null, null, null, null, null]
        }
      ]
    },
    sensivities: [
        {
          name: "Sensitivity 1",
          columns: [
            { name: "casing", label: "Casing", field: "", align: "left" },
            { name: "openHole", label: "Open Hole", field: "", align: "left" }
          ],
          typesOfHole: [ 
            {
              id: "Tripping in",
              casing: null,
              openHole: null
            },
            {
              id: "Tripping out",
              casing: null,
              openHole: null
            },
            {
              id: "Rotating on bottom",
              casing: null,
              openHole: null
            },
            {
              id: "Slide drilling",
              casing: null,
              openHole: null
            },
            {
              id: "Back reaming",
              casing: null,
              openHole: null
            }
          ]
        }
    ],
    isTDSensitivity: false,
    SensitivityDialog: false,
    incremetVisibility: false,
    sensitivityResultsDTO: {},
    hydraulicSensitivityDTO: {},
    surgeSwabSensitivityDTO: {},
    sensitivityIndices: [1],
    rigDTO: {},
    rigDTOSurgeSwab: {},
    sensitivityParameters:{}
}

  const getters = {
    isTDSensitivity(state){
      return state.isTDSensitivity;
    },
    sensitivityParameters(state){
      return state.sensitivityParameters;
    },
    customTable(state){
      return state.customTable;
    },
    customColumns(state){
      return state.customColumns;
    },
    excelFileName(state){
      return state.excelFileName;
    },
    tableTitle(state){
      return state.tableTitle;
    },
    modulesParams(state){
      return state.modulesParams;
    },
    isRunning(state){
      return state.isRunning;
    },
    rigDTOSurgeSwab(state){
      return state.rigDTOSurgeSwab
    },
    surgeSwabResults(state){
      return state.surgeSwabResults;
    },
    surgeSwabSensitivityDTO(state){
      return state.surgeSwabSensitivityDTO;
    },
    hydraulicSensitivityDTO(state){
      return state.hydraulicSensitivityDTO;
    },
    hydraulicsResults(state){
      return state.hydraulicsResults;
    },
    sensitivityIndices(state){
      return state.sensitivityIndices;
    },
    sensitivityResultsDTO(state){
      return state.sensitivityResultsDTO;
    },
    incremetVisibility(state){
      return state.incremetVisibility;
    },
    SensitivityDialog(state){
      return state.SensitivityDialog;
    },
    sensitivityColumns(state){
      return state.sensitivityColumns;
    },
    sensitivity(){
      return state.sensitivity;
    },
    sensivities(){
      return state.sensivities;
    },
    tubingSegmentLabels(state){
      return state.tubingSegmentLabels;
    },
    holeSegmentLabels(state){
      return state.holeSegmentLabels;
    },
   segmentPipeList(state){
      return state.segmentPipeList;
    },
    xMax(state){
      return state.xMax;
    },
    yMax(state){
      return state.yMax;
    },
    trippingInResults(state){
      return state.trippingInResults;
    },
    trippingOutResults(state){
      return state.trippingOutResults;
    },
    drillingResults(state){
      return state.drillingResults;
    },
    rotatingOffBottomResults(state){
      return state.rotatingOffBottomResults;
    },
    slideDrillingResults(state){
      return state.slideDrillingResults;
    },
    backReamingResults(state){
      return state.backReamingResults;
    },
    visible(state){
        return state.visible;
    },
    schematicDTO(state){
      return state.schematicDTO;
    },
    holeSegmentLast(state){
      return state.holeSegmentLast;
    },
    rigDTO(state){
      return state.rigDTO;
    }
}

const mutations = {
  setIsTDSensitivity(state, payload){
    state.isTDSensitivity = payload;
  },
  setSensitivityParameters(state, payload){

    console.log("sensitivityParameters: ", payload);
    state.sensitivityParameters = payload
  },
  setCustomColumns(state, payload){
    var i = 0, length = payload.data.length;
    state.customColumns = [];
    var customColumn = {
      name: payload.xAxisData.actualName,
      label: payload.xAxisData.name + " (" + (payload.xAxisData.unit) + ")",
      field: payload.xAxisData.actualName,
      align: "left"
    }
    state.customColumns.push(customColumn);
    for(i = 0; i < length; i++){
      customColumn = {
        name: payload.data[i].actualName,
        label: payload.data[i].name + " (" + (payload.yAxisData.unit) + ")",
        field: payload.data[i].actualName,
        align: "left"
      }
      state.customColumns.push(customColumn);
    }
  
    //console.log("customColumns: ", state.customColumns);
    console.log("customColumns Seen 1");

  },
  setCustomColumnsForReport(state, payload){
    state.customColumns = payload.columns;
  },
  setCustomTable(state, payload){
    var i = 0, j = 0, nColumns = payload.data.length;
    var nRows = payload.data[j].x.length;
    state.customTable = [];

    for(i = 0; i < nRows; i++){
      var rowData = {};

      for(j = 0; j < nColumns; j++){
        if(payload.isReversed == false){
          rowData[payload.xAxisData.actualName] = payload.data[j].x[i];
          rowData[payload.data[j].actualName] = payload.data[j].y[i];
        }else{
          rowData[payload.xAxisData.actualName] = payload.data[j].y[i];
          rowData[payload.data[j].actualName] = payload.data[j].x[i];
        }
        
      }
      state.customTable.push(rowData);
    }
  
    console.log("customTable Seen 1");
    //console.log("customTable: ", state.customTable);
    //console.log("customTable Seen 2");

  },
  setCustomTableForReport(state, payload){
    state.customTable = payload.data;

  },
  setExcelFileName(state, payload){
    state.excelFileName = payload.excelFileName;
  },
  setTableTitle(state, payload){
    state.tableTitle = payload.tableTitle;
  },
  setIsRunning(state, payload){
    state.isRunning = payload;
  },
  setSurgeSwabResults(state, payload){
    state.surgeSwabResults = payload;
  },
  setHydraulicsResults(state, payload){
    state.hydraulicsResults = payload;
    //console.log("rotatingOffBottomResults", state.rotatingOffBottomResults )
  },
  setRotatingOffBottomResults(state, payload){
    state.rotatingOffBottomResults = payload;
    console.log("rotatingOffBottomResults", state.rotatingOffBottomResults )
  },
  setTrippingInResults(state, payload){
    state.trippingInResults = payload;
    console.log("trippingInResults", state.trippingInResults )
  },
  setTrippingOutResults(state, payload){
    state.trippingOutResults = payload;
    console.log("trippingOutResults", state.trippingOutResults )
  },
  setDrillingResults(state, payload){
    state.drillingResults = payload;
    console.log("drillingResults", state.drillingResults )
  },
  setSlideDrillingResults(state, payload){
    state.slideDrillingResults = payload;
    console.log("slideDrillingResults", state.slideDrillingResults )
  },
  setBackReamingResults(state, payload){
    state.backReamingResults = payload;
    console.log("backReamingResults", state.backReamingResults )
  },
    showSensitivityDialog(state, payload){
      state.SensitivityDialog = payload;
      state.incremetVisibility = payload;
    },
    initializeSensitivityIndices(state){
      state.sensitivityIndices = [];
      var i = 0;
      for(i = 1; i <= state.noOfSensitivities; i++){
        state.sensitivityIndices.push(i);
      }
    },
    addSensitivity(state) {

        
    if(state.sensitivityParameters.noOfSensitivities  < 5){
      state.sensitivityParameters.noOfSensitivities++;
      
      switch(state.sensitivityParameters.noOfSensitivities){
        case 2:
          state.sensitivityParameters.isThreeVisible = false;
          state.sensitivityParameters.isFourVisible = false;
          state.sensitivityParameters.isFiveVisible = false;
          break;
        case 3:
          state.sensitivityParameters.isThreeVisible = true;
          state.sensitivityParameters.isFourVisible = false;
          state.sensitivityParameters.isFiveVisible = false;
          break;
        case 4:
          state.sensitivityParameters.isThreeVisible = true;
          state.sensitivityParameters.isFourVisible = true;
          state.sensitivityParameters.isFiveVisible = false;
          break;
        case 5:
          state.sensitivityParameters.isThreeVisible = true;
          state.sensitivityParameters.isFourVisible = true;
          state.sensitivityParameters.isFiveVisible = true;
          break
      }

      state.sensitivityIndices = [];
      var i = 0;
      for(i = 1; i <= state.sensitivityParameters.noOfSensitivities; i++){
        state.sensitivityIndices.push(i);
      }
    }
        
    },
    removeSensitivity(state) {
      if(state.sensitivityParameters.noOfSensitivities > 2)
      {
        state.sensitivityParameters.noOfSensitivities--;
        switch(state.sensitivityParameters.noOfSensitivities){
          case 2:
            state.sensitivityParameters.isThreeVisible = false;
            state.sensitivityParameters.isFourVisible = false;
            state.sensitivityParameters.isFiveVisible = false;
            break;
          case 3:
            state.sensitivityParameters.isThreeVisible = true;
            state.sensitivityParameters.isFourVisible = false;
            state.sensitivityParameters.isFiveVisible = false;
            break;
          case 4:
            state.sensitivityParameters.isThreeVisible = true;
            state.sensitivityParameters.isFourVisible = true;
            state.sensitivityParameters.isFiveVisible = false;
            break;
          case 5:
            state.sensitivityParameters.isThreeVisible = true;
            state.sensitivityParameters.isFourVisible = true;
            state.sensitivityParameters.isFiveVisible = true;
            break
        }
        state.sensitivityIndices = [];
        var i = 0;
        for(i = 1; i <= state.sensitivityParameters.noOfSensitivities; i++){
          state.sensitivityIndices.push(i);
        }
      }  

    },
    RunSensitivities(state, payload){
      console.log("Sensitivities", payload);
      state.sensitivityResultsDTO = payload;
    },
    RunSimulation(state, payload){
    //console.log("Sensitivities", payload);
    state.sensitivityResultsDTO = payload;
    //state.visible = false;
    //state.showSimulatedReturnData = true

  },
  RunHydraulics(state, payload){
    //console.log("sensitivityResultsDTO", payload);
    state.hydraulicSensitivityDTO = payload.simulationResultsDTOs;
    state.rigDTO = payload.rigDTO;
    //console.log("simulationResultsDTOs", state.hydraulicSensitivityDTO);
    //console.log("rigDTO", state.rigDTO);
    state.visible = false;
    state.showSimulatedReturnData = true
  },
  RunSurgeSwab(state, payload)
  {
    state.surgeSwabSensitivityDTO = payload.simulationResultsDTOs;
    state.rigDTOSurgeSwab = payload.rigDTO;
    state.visible = false;
    state.showSimulatedReturnData = true
  },
  DrawSchematic(state, payload){
    console.log("schematicDTO: ", payload)
    state.schematicDTO = payload;
    // var nHoleSegments = state.schematicDTO.holeSegments.length;
    // state.holeSegmentLast = state.schematicDTO.holeSegments[nHoleSegments-1];
    state.xMax = state.schematicDTO.xMax;
    state.yMax = state.schematicDTO.yMax;
    
  },
  DrawPipeBuckledSections(state, payload){
    state.segmentPipeList = payload;
  },
  DrawHoleSegmentLabel(state, payload){
    state.holeSegmentLabels = payload;
  },
  DrawTubingSegmentLabel(state, payload){
    state.tubingSegmentLabels = payload;
  },
  ClearSimulationStore(state){
    state.segmentPipeList = [];
    state.holeSegmentLabels = [];
    state.tubingSegmentLabels = [];
    state.schematicDTO = {};
    state.xMax = 0;
    state.yMax = 0;
    state.surgeSwabSensitivityDTO = {};
    state.rigDTOSurgeSwab = {};
    state.hydraulicSensitivityDTO = {};
    state.rigDTO = {};
    state.rotatingOffBottomResults = [];
    state.hydraulicsResults = [];
    state.surgeSwabResults = [];
    state.trippingInResults = [];
    state.trippingOutResults = [];
    state.drillingResults = [];
    state.slideDrillingResults = [];
    state.backReamingResults = [];
    state.customTable= [];
    state.customColumns = [];
    state.sensitivityParameters = {};
  },
  GetSensitivityParameters(state, payload){
    state.sensitivityParameters = payload;
  }

}

const actions = {
  RunSensitivities(context, payload)
  {

    let config = {
      headers: {
        tenantcode: payload.companyName,
      },
      useCredentails: true
    }
    

    //console.log("payload: ", payload)

    if(context.state.modulesParams.torqueAndDrag == true){
      context.commit('dataImportStore/SetLoaderParameters', {
        showLoader: true,
        showImportView: false
      }, {root:true}); 
      context.commit('authStore/setStatusMessageBarVisibility',  
      {
        actionMessage: "Torque and Drag simualtion running...",
        visibility: true
      }, {root:true}); 

      console.log("isTDSensitivity: ", context.state.isTDSensitivity)
      console.log("sensitivityParameters: ", context.state.sensitivityParameters)
      const req = {
        userId: payload.userId,
        designId: payload.designId,
        companyName: payload.companyName,
        sensitivityParameters: context.state.sensitivityParameters,
        isTDSensitivity: context.state.isTDSensitivity,
        allInputsDTO: payload.allInputsDTO
       }

       console.log("req: ",req);
      return new Promise((resolve, reject) => {
        https().post('Commons/RunSensitivities', req, config)
         .then(response => {
 
         console.log("response: ", response)
          
           context.commit('RunSensitivities', response.data);
           context.commit('dataImportStore/SetLoaderParameters', {
             showLoader: false,
             showImportView: true
           }, {root:true}); 
           context.commit('authStore/setStatusMessageBarVisibility',  
           {
             actionMessage: "Torque and Drag simulation completed successfully",
             visibility: true
           }, {root:true}); 
           context.dispatch('RunHydraulics', payload);               
             resolve(response)
             
         })
         .catch(error => {
           //console.log("RunSimulation error")
           console.error(error.response.data);
           context.commit('dataImportStore/SetLoaderParameters', {
             showLoader: false,
             showImportView: true
           }, {root:true}); 
           context.commit('authStore/setStatusMessageBarVisibility',  
           {
             actionMessage: "Torque and Drag simualtion failed",
             visibility: true
           }, {root:true}); 
           context.dispatch('RunHydraulics', payload);   
           context.commit('setIsRunning', true);
           reject(error)
         })
     })
    }else{
      context.dispatch('RunHydraulics', payload);   
      context.commit('setIsRunning', true);
    }
  },
RunSimulation(context, payload)
  {

    let config = {
      headers: {
        tenantcode: payload.companyName,
      },
      //useCredentails: true
    }
    context.state.visible = true;
    context.state.showSimulatedReturnData = false
    //this.$router.push('/simulationConsole');

    console.log("response: ", payload)
    var ids = payload.designId.toString() + "&" + payload.userId.toString();

    if(context.state.modulesParams.torqueAndDrag == true){
      context.commit('dataImportStore/SetLoaderParameters', {
        showLoader: true,
        showImportView: false
      }, {root:true}); 
      context.commit('authStore/setStatusMessageBarVisibility',  
      {
        actionMessage: "Torque and Drag simualtion running...",
        visibility: true
      }, {root:true}); 
      return new Promise((resolve, reject) => {
        https().post('Commons/RunSimulation', payload.allInputsDTO, config)
         .then(response => {
 
         console.log("response: ", response)
 
           context.commit('RunSimulation', response.data)  
           context.commit('dataImportStore/SetLoaderParameters', {
             showLoader: false,
             showImportView: true
           }, {root:true}); 
           context.commit('authStore/setStatusMessageBarVisibility',  
           {
             actionMessage: "Torque and Drag simulation completed successfully",
             visibility: true
           }, {root:true}); 
           context.dispatch('RunHydraulics', payload);               
             resolve(response)
             
         })
         .catch(error => {
           //console.log("RunSimulation error")
           console.error(error.response.data);
           context.commit('dataImportStore/SetLoaderParameters', {
             showLoader: false,
             showImportView: true
           }, {root:true}); 
           context.commit('authStore/setStatusMessageBarVisibility',  
           {
             actionMessage: "Torque and Drag simualtion failed",
             visibility: true
           }, {root:true}); 
           context.dispatch('RunHydraulics', payload);   
           context.commit('setIsRunning', true);
           reject(error)
         })
     })
    }else{
      context.dispatch('RunHydraulics', payload);   
      context.commit('setIsRunning', true);
    }

   
  },
  RunHydraulics(context, payload)
  {

    let config = {
      headers: {
        tenantcode: payload.companyName,
      },
      useCredentails: true
    }

    console.log("response: ", payload)
    var ids = payload.designId.toString() + "&" + payload.userId.toString();

    if(context.state.modulesParams.hydraulics == true){
      context.commit('dataImportStore/SetLoaderParameters', {
        showLoader: true,
        showImportView: false
      }, {root:true}); 
      context.commit('authStore/setStatusMessageBarVisibility',  
      {
        actionMessage: "Hydraulics simualtion running...",
        visibility: true
      }, {root:true}); 

    return new Promise((resolve, reject) => {
       https().post('Commons/RunHydraulics', payload.allInputsDTO, config)
        .then(response => {

        //console.log("data: ", response.data)

          context.commit('RunHydraulics', response.data)  
          context.commit('dataImportStore/SetLoaderParameters', {
            showLoader: false,
            showImportView: true
          }, {root:true}); 
          context.commit('authStore/setStatusMessageBarVisibility',  
          {
            actionMessage: "Hyraulics simulation completed successfully",
            visibility: true
          }, {root:true}); 
          context.dispatch('RunSurgeSwab', payload);   
          context.commit('setIsRunning', true);               
            resolve(response)
            
        })
        .catch(error => {
          console.log("RunHydraulics error")
          context.commit('dataImportStore/SetLoaderParameters', {
            showLoader: false,
            showImportView: true
          }, {root:true}); 
          context.commit('authStore/setStatusMessageBarVisibility',  
          {
            actionMessage: "Hydraulics simualtion failed",
            visibility: true
          }, {root:true});   
          context.dispatch('RunSurgeSwab', payload);   
          context.commit('setIsRunning', true); 
          reject(error)
        })
    })
  }else{
    context.dispatch('RunSurgeSwab', payload);   
    context.commit('setIsRunning', true);

  }
  },
  RunSurgeSwab(context, payload)
  {


    let config = {
      headers: {
        tenantcode: payload.companyName,
      },
      useCredentails: true
    }
    //console.log("response: ", payload)
    var ids = payload.designId.toString() + "&" + payload.userId.toString();
    if(context.state.modulesParams.surgeAndSwab == true){
      context.commit('dataImportStore/SetLoaderParameters', {
        showLoader: true,
        showImportView: false
      }, {root:true}); 
      context.commit('authStore/setStatusMessageBarVisibility',  
      {
        actionMessage: "Surge and swab simualtion running...",
        visibility: true
      }, {root:true}); 

    return new Promise((resolve, reject) => {
       https().post('Commons/RunSurgeSwab', payload.allInputsDTO, config)
        .then(response => {

        console.log("response.data: ", response.data)

          context.commit('RunSurgeSwab', response.data)  
          context.commit('dataImportStore/SetLoaderParameters', {
            showLoader: false,
            showImportView: true
          }, {root:true}); 
          context.commit('authStore/setStatusMessageBarVisibility',  
          {
            actionMessage: "Surge and swab simulation completed successfully",
            visibility: true
          }, {root:true});  
          //context.commit('setIsRunning', true);              
            resolve(response)
            
        })
        .catch(error => {
          console.log("RunSurgeSwab error: ", error)
          context.commit('dataImportStore/SetLoaderParameters', {
            showLoader: false,
            showImportView: true
          }, {root:true}); 
          context.commit('authStore/setStatusMessageBarVisibility',  
          {
            actionMessage: "Surge and swab simualtion failed",
            visibility: true
          }, {root:true});    
          context.commit('setIsRunning', true);
          reject(error)
        })
    })
  }
  },
  
DrawSchematic(context, payload)
{
  let config = {
    headers: {
      tenantcode: payload.companyName,
    },
    //useCredentails: true
  }
    
    return new Promise((resolve, reject) => {
       https().post('Commons/DrawSchematic', payload.allInputsDTO, config)
        .then(response => {

        console.log("response: ", response)

          context.commit('DrawSchematic', response.data)
          context.commit('dataImportStore/SetLoaderParameters', {
            showLoader: false,
            showImportView: true
          }, {root:true}); 
          context.commit('authStore/setStatusMessageBarVisibility',  
          {
            actionMessage: "Drawing well schematic successful",
            visibility: true
          }, {root:true});              
            resolve(response)
            
        })
        .catch(error => {
          console.log("DrawSchematic error")
          context.commit('dataImportStore/SetLoaderParameters', {
            showLoader: false,
            showImportView: true
          }, {root:true}); 
          context.commit('authStore/setStatusMessageBarVisibility',  
          {
            actionMessage: "Drawing well schematic failed",
            visibility: true
          }, {root:true});    
          reject(error)
        })
    })
  },
DrawPipeBuckledSections(context, payload)
{

  let config = {
    useCredentails: true
  }
  
    context.state.visible = true;
    context.state.showSimulatedReturnData = false
    
    //console.log("response: ", payload)
    //this.$router.push('/schematic');
    
    return new Promise((resolve, reject) => {
      https().post('Commons/DrawPipeBuckledSections', payload, config)
        .then(response => {

        //console.log("response: ", response)

          context.commit('DrawPipeBuckledSections', response.data)              
            resolve(response)
            
        })
        .catch(error => {
          console.log("DrawPipeBuckledSections error")
          context.state.visible = false;
          context.state.showSimulatedReturnData = true
          reject(error)
        })
    })
  },
  DrawHoleSegmentLabel(context, payload2)
  {

    let config = {
      headers: {
        tenantcode: payload2.companyName,
      },
      useCredentails: true
    }
      context.state.visible = true;
      context.state.showSimulatedReturnData = false
      
      //console.log("response: ", payload)
      //this.$router.push('/schematic');
      
      return new Promise((resolve, reject) => {
        https().post('Commons/DrawHoleSegmentLabel', payload2.payload, config)
          .then(response => {

          //console.log("response: ", response)

            context.commit('DrawHoleSegmentLabel', response.data)              
              resolve(response)
              
          })
          .catch(error => {
            console.log("DrawHoleSegmentLabel error")
            context.state.visible = false;
            context.state.showSimulatedReturnData = true
            reject(error)
          })
      })
    },
  DrawTubingSegmentLabel(context, payload2)
  {

    let config = {
      headers: {
        tenantcode: payload2.companyName,
      },
      useCredentails: true
    }
      context.state.visible = true;
      context.state.showSimulatedReturnData = false
      
      //console.log("response: ", payload)
      //this.$router.push('/schematic');
      
      return new Promise((resolve, reject) => {
        https().post('Commons/DrawTubingSegmentLabel', payload2.payload, config)
          .then(response => {

          //console.log("response: ", response)

            context.commit('DrawTubingSegmentLabel', response.data)              
              resolve(response)
              
          })
          .catch(error => {
            console.log("DrawTubingSegmentLabel error")
            context.state.visible = false;
            context.state.showSimulatedReturnData = true
            reject(error)
          })
      })
    },
    ClearSimulationStore(context, payload){
      context.commit('ClearSimulationStore');
    },
    PostSensitivityParameters(context, payload)
    {

      let config = {
        headers: {
          tenantcode: payload.companyName,
        },
        //useCredentails: true
      }
        
        return new Promise((resolve, reject) => {
          https().post('SensitivityParameters/PostSensitivityParameters', payload, config)
            .then(response => {
            //setSensitivityParameters
            context.commit('setSensitivityParameters', response.data)
              
            context.commit('dataImportStore/SetLoaderParameters', {
                showLoader: false,
                showImportView: true
              }, {root:true}); 
              context.commit('authStore/setStatusMessageBarVisibility',  
              {
                actionMessage: "Sensitivity parameters saved successful",
                visibility: true
              }, {root:true});              
                resolve(response)
                
            })
            .catch(error => {
              console.log("PostSensitivityParameters error")
              context.commit('dataImportStore/SetLoaderParameters', {
                showLoader: false,
                showImportView: true
              }, {root:true}); 
              context.commit('authStore/setStatusMessageBarVisibility',  
              {
                actionMessage: "Saving sensitivity parameters failed",
                visibility: true
              }, {root:true});    
              reject(error)
            })
        })
    },

    GetSensitivityParameters(context, payload)
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

      //var ids = payload.designId.toString() + "&" + payload.userId.toString();

      return new Promise((resolve, reject) => {
    

        https().get('SensitivityParameters/GetSensitivityParameters/' + payload.designId, config)
          .then(response => {
            
            console.log('SensitivityParameters: ', response.data);
            context.commit('GetSensitivityParameters', response.data)   
            context.commit('dataImportStore/SetLoaderParameters', {
              showLoader: false,
              showImportView: true
            }, {root:true});           
              resolve(response)
              
          })
          .catch(error => {
            console.log("GetSensitivityParameters error")
            context.commit('dataImportStore/SetLoaderParameters', {
              showLoader: false,
              showImportView: true
            }, {root:true});
            reject(error)
          })
      })
    },

}

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state
}