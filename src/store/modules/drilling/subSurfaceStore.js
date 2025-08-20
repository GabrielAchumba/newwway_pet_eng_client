import { https } from 'src/httpservices/services';

const state = {
    porePressures:[],
    fractureGradients:[],
    formationTops:[],
    geothermalGradients:[],
    formationInfluxes:[]
  }

  const getters = {
    porePressures(state){
      return state.porePressures;
    },
    fractureGradients(state){
        return state.fractureGradients;
    },
    formationTops(state){
        return state.formationTops;
    },
    geothermalGradients(state){
        return state.geothermalGradients;
    },
    formationInfluxes(state){
        return state.formationInfluxes;
    }
}

const mutations = {

}

const actions = {


}

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state
}