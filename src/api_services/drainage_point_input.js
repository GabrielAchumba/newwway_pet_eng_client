import {
  get,
  remove,
  post,
  put,
  uploadPhoto,
  https
} from "src/httpservices/services";


export const findConfigInput = async (drainagePointId, assetGroupId) => {


    var response = await get({url: `config/find-config-input/${drainagePointId}/${assetGroupId}`});
    return response.data;
}


export const createConfigInput = async (payload)  => {
    
    try {
        var response = await post({
            url: "config/create-config-input",
            req: payload
        });

        return response;

    } catch (error) {

        return error;
    }
}

export const createBulfConfigInput = async (payload)  => {
    
    try {
        var response = await post({
            url: "config/create-bulk-config-input",
            req: payload
        });

        return response;

    } catch (error) {

        return error;
    }
}

export const findDCAInput = async (drainagePointId, assetGroupId) => {


    var response = await get({url: `dca/find-dca-input/${drainagePointId}/${assetGroupId}`});
    return response.data;
}


export const createDCAInput = async (payload)  => {
    
    try {
        var response = await post({
            url: "dca/create-dca-input",
            req: payload
        });

        return response;

    } catch (error) {

        return error;
    }
}

export const createBulkDCAInput = async (payload)  => {
    
    try {
        var response = await post({
            url: "dca/create-bulk-dca-input",
            req: payload
        });

        return response;

    } catch (error) {

        return error;
    }
}

export const findIPRInput = async (drainagePointId, assetGroupId) => {


    var response = await get({url: `ipr/find-ipr-input/${drainagePointId}/${assetGroupId}`});
    return response.data;
}


export const createIPRInput = async (payload)  => {
    
    try {
        var response = await post({
            url: "ipr/create-ipr-input",
            req: payload
        });

        return response;

    } catch (error) {

        return error;
    }
}


export const createVLPInput = async (payload)  => {
    
    try {
        var response = await post({
            url: "vlp/create-vlp-input",
            req: payload
        });

        return response;

    } catch (error) {

        return error;
    }
}

export const findConstraintsInput = async (drainagePointId, assetGroupId) => {


    var response = await get({url: `constraints/find-constraints-input/${drainagePointId}/${assetGroupId}`});
    return response.data;
}


export const createConstraints = async (payload)  => {
    
    try {
        var response = await post({
            url: "constraints/create-constraints-input",
            req: payload
        });

        return response;

    } catch (error) {

        return error;
    }
}


export const createBulkConstraints = async (payload)  => {
    
    try {
        var response = await post({
            url: "constraints/create-bulk-constraints-input",
            req: payload
        });

        return response;

    } catch (error) {

        return error;
    }
}

export const findSchedulesInput = async (drainagePointId, assetGroupId) => {


    var response = await get({url: `schedules/find-schedules-input/${drainagePointId}/${assetGroupId}`});
    return response.data;
}


export const createSchedules = async (payload)  => {
    
    try {
        var response = await post({
            url: "schedules/create-schedules-input",
            req: payload
        });

        return response;

    } catch (error) {

        return error;
    }
}