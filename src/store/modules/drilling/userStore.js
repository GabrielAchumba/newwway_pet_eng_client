import { $http } from "boot/axios";

const state =  {
  user: {},
  identity: {}

}

const getters = {
    user(state){
      return state.user;
    },
    identity(state){
      return state.identity;
    }
}

const mutations = {
  createUser(state, payload){
        state.user = payload;
        alert("User succesfully registered")
    },
    createIdentity(state, payload){
      state.identity = payload;
  }

}

const actions = {
  createUser(context, payload)
    {
      let config = {
        headers: {
          tenantcode: payload.companyName,
        },
        useCredentails: true
      }

      return new Promise((resolve, reject) => {
        console.log(payload)
         $http.post('Users/PostUser', payload.user)
          .then(response => {
              
            context.commit('createUser', response.data)              
              resolve(response)
              
          })
          .catch(error => {
            console.log("createUser error")
            reject(error)
          })
      })
    },
    createIdentity(context, payload)
    {
      let config = {
        useCredentails: true
      }

      return new Promise((resolve, reject) => {
        console.log(payload)
         $http.post('Identities/PostIdentity', payload.user)
          .then(response => {
              
            context.commit('createIdentity', response.data) 
            //payload.user.passWord =  response.data.passWord;
            context.dispatch('createUser',  payload)                   
              resolve(response)
              
          })
          .catch(error => {
            console.log("createIdentity error")
            reject(error)
          })
      })
    }
}

export default {
    namespaced: true,
    getters,
    mutations,
    actions,
    state
  }