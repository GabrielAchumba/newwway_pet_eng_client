import { $http } from 'src/boot/axios'; 

const get = async (payload) => {

  console.log("get called")
  var token = validateSession();
  $http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  let config = {
    headers: {
      //tenantcode: payload.companyName,
    },
    //useCredentails: true
  }

  return new Promise((resolve, reject) => {
      
    $http.get(payload.url, config)
     .then(response => {            
         resolve(response)
         
     })
     .catch(error => {
       reject(error)
     })
  })
}

const remove = async (payload) => {

  var token = validateSession();
  $http.defaults.headers.common['Authorization'] = 'Bearer ' + token;

  return new Promise((resolve, reject) => {
      
    $http.delete(payload.url)
     .then(response => {             
         resolve(response)
         
     })
     .catch(error => {
       reject(error)
     })
  })
}

const post = (payload) => {

  var token = validateSession();
  //$http.defaults.headers.common['Authorization'] = 'Bearer ' + token;

  console.log($http)
  console.log(payload.url)
  console.log(payload.req)

  return new Promise((resolve, reject) => {
      
    $http.post(payload.url, payload.req)
     .then(response => {             
         resolve(response)
         
     })
     .catch(error => {
       reject(error)
     })
 })
}

const put = (payload) => {

  var token = validateSession();
  $http.defaults.headers.common['Authorization'] = 'Bearer ' + token;

  return new Promise((resolve, reject) => {
      
    $http.put(payload.url, payload.req)
     .then(response => {             
         resolve(response)
         
     })
     .catch(error => {
       reject(error)
     })
 })
}

const uploadPhoto = async (payload) => {

    var token = validateSession();
    $http.defaults.headers.common['Authorization'] = 'Bearer ' + token;

    return new Promise((resolve, reject) => {
      $http.post(payload.url, payload.request,{
        headers: {'Content-Type': 'multipart/form-data'},
        onUploadProgress: uploadEvent => {}
      })
        .then(response => {           
            resolve(response)
            
        })
        .catch(error => {
          reject(error)
        })
    })
}

const validateSession = () => {
  //console.log("validateSession called")
  const key = "seassionObj";
  let seassionVal = sessionStorage.getItem(key);
  //console.log("seassionVal: ", seassionVal)
  if (seassionVal !== null) {
    let sessionObj = JSON.parse(seassionVal);
    let expiredAt = new Date(sessionObj.expiredAt);
    if (expiredAt > new Date()) { // Validate expiry date.
      return sessionObj.value;
    } else {
      sessionStorage.removeItem(key);
    }
  }
  /* else{
    console.log("session expired")
    this.$router.push('/');
  } */
    return null;
}

const https = () => {
    var token = validateSession()
    //console.log("token: ", token);
    $http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    //$http.defaults.headers.common['Authorization'] = token;
    return $http;
}

export {
  get,
  remove,
  post,
  put,
  uploadPhoto,
  https
}