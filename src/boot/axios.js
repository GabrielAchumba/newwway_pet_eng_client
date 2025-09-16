import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
const processEnvNOEENV = "dev";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const  $http = axios.create({  
  baseURL: (processEnvNOEENV == 'production') ? 'https://tdragapi-bwo8s.ondigitalocean.app/' : 'http://localhost:8000/',
  headers: {
    'Content-Type': 'application/json',
    //"Access-Control-Allow-Methods":"GET,PUT,POST,DELETE,PATCH,OPTIONS",
    // "Access-Control-Allow-Credentials":true
  }
})

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api =  $http
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export {  $http }
