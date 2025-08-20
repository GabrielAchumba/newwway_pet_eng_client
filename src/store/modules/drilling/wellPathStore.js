import { https } from 'src/httpservices/services';
import { copy } from "boot/utils";
import { devCalcParams } from 'boot/devSurveyManager'

const state = {
    deviationSurveys:[],
    isImportDialogVisible: false,
    layout: {
      showlegend: true,
      title: "Gas Rate",
      height: 900,
      xaxis: {
        title: "",
        titlefont: {
          family: "Arial, sans-serif",
          size: 14,
          color: "black"
        },
        showticklabels: true,
        tickangle: "auto",
        tickfont: {
          family: "Old Standard TT, serif",
          size: 14,
          color: "black"
        },
        showgrid: true,
        showline: true,
        mirror: "ticks",
        gridcolor: "#bdbdbd",
        gridwidth: 2,
        zerolinecolor: "#969696",
        zerolinewidth: 4,
        linecolor: "#636363",
        linewidth: 4
      },
      yaxis: {
        autorange: "reversed",
        title: "Gas Rate (MMScf)",
        titlefont: {
          family: "Arial, sans-serif",
          size: 14,
          color: "black"
        },
        showticklabels: true,
        tickangle: 45,
        tickfont: {
          family: "Old Standard TT, serif",
          size: 14,
          color: "black"
        },
        showgrid: true,
        showline: true,
        mirror: "ticks",
        gridcolor: "#bdbdbd",
        gridwidth: 2,
        zerolinewidth: 0,
        linecolor: "#636363",
        linewidth: 4
      }
    },
    seriesCollection: [],
    selectedVariable: "Measured Depth",
    seriesStore: [],
    deviationSurveyDescriptions: {
      measuredDepth: "Please Enter Measured Depth",
      trueVerticalDepth: "Please Enter True Vertical Depth",
      inclination: "Please Enter Inclination",
      azimuth: "Please Enter Azimuth",
      northSouth: "Please Enter North/South",
      eastWest: "Please Enter East/West",
      verticalSection: "Please Enter Vertical Section",
      doglegSeverity: "Please Enter Dogleg Severity"
    }

  }

  const getters = {
    deviationSurveyDescriptions(state){
      return state.deviationSurveyDescriptions;
    },
    deviationSurveys(state){
      return state.deviationSurveys;
    },
    isImportDialogVisible(state){
      return state.isImportDialogVisible;
    },
    layout(state){
      return state.layout;
    },
    seriesCollection(state){
      return state.seriesCollection;
    },
    selectedVariable(state){
      return state.selectedVariable;
    },
    seriesStore(state){
      return state.seriesStore;
    }
}

const mutations = {
  PostDeviationSurvey(state){
    //console.log("payload.previewSurveyData: ", payload.previewSurveyData)
    state.isImportDialogVisible = false;
  },
  SetisImportDialogVisible(state, payload){
    state.isImportDialogVisible = payload;
  },
  GetDeviationSurveys(state, payload){
    state.deviationSurveys = payload;
  },
  SaveSurveyTable(state, payload){
    state.deviationSurveys.push(payload);
    //console.log("deviationSurveys: ", state.deviationSurveys)
  },
  updateSurveyTable(state, payload){
    var i = 0;
    var lent = state.deviationSurveys.length;
    for(i = 0; i < lent; i++){
      if(state.deviationSurveys[i].measuredDepth == payload.measuredDepth){
          state.deviationSurveys[i] = payload.surveyRecord;
          break;
      }
    }
    //console.log("deviationSurveys: ", state.deviationSurveys)
  },
  ClearDeviationSurveys(state){
    state.deviationSurveys = [];
  }
}

const actions = {
  PostDeviationSurvey(context, payload)
  {

    let config = {
      headers: {
        tenantcode: payload.companyName,
      },
      useCredentails: true
    }

    state.deviationSurveys = [];
    state.deviationSurveys = payload.deviationSurveys;
    console.log("trueVerticalDepth1: ", state.deviationSurveys[1].trueVerticalDepth)
    if( state.deviationSurveys[1].trueVerticalDepth == 0){
      devCalcParams.calculateDevParams(state.deviationSurveys);
      state.deviationSurveys = devCalcParams.deviationSurveys;
      payload.deviationSurveys = state.deviationSurveys;
    }
    

    

    return new Promise((resolve, reject) => {
  

       https().post('DeviationSurveys/PostDeviationSurvey', payload, config)
        .then(response => {
            
          context.commit('PostDeviationSurvey', response.data) 
          context.commit('dataImportStore/SetLoaderParameters', {
            showLoader: false,
            showImportView: true
          }, {root:true});
          context.commit('authStore/setStatusMessageBarVisibility',  
          {
            actionMessage: "Deviation survey data saved successfully",
            visibility: true
          }, {root:true});    
              
            resolve(response)
            
        })
        .catch(error => {
          console.log("PostDeviationSurvey error")
          context.commit('dataImportStore/SetLoaderParameters', {
            showLoader: false,
            showImportView: true
          }, {root:true});
          context.commit('authStore/setStatusMessageBarVisibility',  
          {
            actionMessage: "Deviation survey data failed to save. Please check your data",
            visibility: true
          }, {root:true});    
          reject(error)
        })
    })
  },
  GetDeviationSurveys(context, payload)
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
    
   context.commit('ClearDeviationSurveys')
    //var ids = payload.designId.toString() + "&" + payload.userId.toString();

    return new Promise((resolve, reject) => {
  

       https().get('DeviationSurveys/GetDeviationSurveys/' + payload.designId, config)
        .then(response => {

          //console.log("response.data:", response.data)
          //devCalcParams.calculateDevParams(response.data)
          //console.log("DevCalcParams.DevParams: ", devCalcParams.deviationSurveys)
            
          context.commit('GetDeviationSurveys', response.data)   
          context.commit('dataImportStore/SetLoaderParameters', {
            showLoader: false,
            showImportView: true
          }, {root:true});           
            resolve(response)
            
        })
        .catch(error => {
          console.log("GetDeviationSurveys error")
          context.commit('dataImportStore/SetLoaderParameters', {
            showLoader: false,
            showImportView: true
          }, {root:true});
          reject(error)
        })
    })
  },
  LoadDevSurveySeriesCollection(context, payload)
  {
  
    let config = {
      headers: {
        tenantcode: payload.companyName,
      },
      useCredentails: true
    }
    
    context.state.deviationSurveys = [];
    context.state.seriesStore =[]
    context.state.seriesCollection =[]
 
    return new Promise((resolve, reject) => {
  

       https().get('DeviationSurveys/GetDeviationSurveys/' + payload.designId, config)
        .then(response => {

          
          context.state.deviationSurveys = response.data;
          //console.log("deviationSurveys:", response.data);
            
          var j = 0, i = 0;

          var variableNames =  ["Measured Depth",
                                "True Vertical Depth",
                                "Inclination",
                                "Azimuth",
                                "Vertical Section",
                                "Dogleg Severity",
                                "North/South",
                                "East/West"]

              var length = context.state.deviationSurveys.length;
              var variableNamesCount = variableNames.length;
              var xvalue = 0;
              var xaxisTitle = "";
            
              for (i = 0; i < variableNamesCount; i++) {
                if(payload.xVariableName != variableNames[i]) 
                {

                var series = {
                  x: [],
                  y: [],
                  name: variableNames[i],
                  yaxisTitle: ""
                };

                  for (j = 0; j < length; j++) {
                      
                      switch(payload.xVariableName) {
                        case "Measured Depth":
                          xvalue = context.state.deviationSurveys[j].measuredDepth;
                          xaxisTitle = "Measured Depth (ft)";
                          series.x.push(xvalue);
                          break;
                        case "True Vertical Depth":
                          xvalue = context.state.deviationSurveys[j].trueVerticalDepth;
                          xaxisTitle = "True Vertical Depth (ft)";
                          series.x.push(xvalue);
                          break;
                        case "Inclination":
                          xvalue = context.state.deviationSurveys[j].inclination;
                          xaxisTitle = "Inclination (deg)";
                          series.x.push(xvalue);
                          break;
                        case "Azimuth":
                          xvalue = context.state.deviationSurveys[j].azimuth;
                          xaxisTitle = "Azimuth (deg)";
                          series.x.push(xvalue);
                          break;
                        case "Vertical Section":
                          xvalue = context.state.deviationSurveys[j].verticalSection;
                          xaxisTitle = "Vertical Section (ft)";
                          series.x.push(xvalue);
                          break;
                        case "Dogleg Severity":
                          xvalue = context.state.deviationSurveys[j].doglegSeverity;
                          xaxisTitle = "Dogleg Severity (deg/100ft)";
                          series.x.push(xvalue);
                          break;
                        case "North/South":
                          xvalue = context.state.deviationSurveys[j].northSouth;
                          xaxisTitle = "North/South (ft)";
                          series.x.push(xvalue);
                          break;
                        case "East/West":
                          xvalue = context.state.deviationSurveys[j].eastWest;
                          xaxisTitle = "East/West (ft)";
                          context.state.layout.yaxis.autorange = "";
                          series.x.push(xvalue);
                          break;
                      }
                      


                      switch (variableNames[i]) {
                        case "Measured Depth":
                          series.y.push(context.state.deviationSurveys[j].measuredDepth);
                          series.yaxisTitle = "Measured Depth (ft)";
                          break;

                        case "True Vertical Depth":
                          series.y.push(context.state.deviationSurveys[j].trueVerticalDepth);
                          series.yaxisTitle = "True Vertical Depth (ft)";
                          break;

                        case "Inclination":
                          series.y.push(context.state.deviationSurveys[j].inclination);
                          series.yaxisTitle = "Inclination (deg)";
                          break;

                        case "Azimuth":
                          series.y.push(context.state.deviationSurveys[j].azimuth);
                          series.yaxisTitle = "Azimuth (deg)";
                          break;

                        case "Vertical Section":
                          series.y.push(context.state.deviationSurveys[j].verticalSection);
                          series.yaxisTitle = "Vertical Section (ft)";
                          break;
                        case "North/South":
                          series.y.push(context.state.deviationSurveys[j].northSouth);
                          series.yaxisTitle = "North/South (ft)";
                          break;
                        case "East/West":
                          series.y.push(context.state.deviationSurveys[j].eastWest);
                          series.yaxisTitle = "East/West (ft)";
                          break;
                      }
                  }

                  context.state.seriesStore.push(copy(series));
                }
                }

                

                var series1 = {
                  x: context.state.seriesStore[0].x,
                  y: context.state.seriesStore[0].y,
                  line: {
                    shape: "spline"
                  },
                  mode: "lines",
                  type: "scatter",
                  name: payload.xVariableName
                };

                context.state.layout.xaxis.title = xaxisTitle;
                context.state.layout.yaxis.title = context.state.seriesStore[0].yaxisTitle;
                context.state.layout.title = "";
                context.state.seriesCollection.push(copy(series1));

                
              console.log("series: ", series1);
              context.dispatch('chartStore/SetChartData',  {
                layout: context.state.layout,
                seriesCollection: context.state.seriesCollection,
                seriesStore: context.state.seriesStore,
                xVariableName: payload.xVariableName,
                chartId: payload.chartId
              }, {root:true})                
            resolve(response)
            
        })
        .catch(error => {
          console.log("GetDeviationSurveys error")
          reject(error)
        })
    })
  },
  ClearDeviationSurveys(context, payload){
    context.commit('ClearDeviationSurveys');
  }



}

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state
}