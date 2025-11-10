import { assetGroups } from "src/temp_database/asset_groups/asset_groups_bk";
import {
  get,
  remove,
  post,
  put,
  uploadPhoto,
  https
} from "src/httpservices/services";


export const fetchStoredNetworks = async (assetGroupId) => {

    var response = await get({url: `network/fetch-all/${assetGroupId}`});
    //console.log(response)
    return response.data;
}


export const storeNetworkRequest = async (payload)  => {
    
    try {
        var response = await post({
            url: "network/store-network",
            req: payload
        });

        return response;

    } catch (error) {

        //console.log("error: ", error)
        return error;
    }
}


export const drawStoredAssetsNetwork = async (assetGroupId, networkName) => {

    var response = await get({url: `network/draw-stored-assets-network/${assetGroupId}/${networkName}`});
    //console.log(response)
    return response.data;
}

export const getEarliestOnstreamDate = async (assetGroupId, networkName) => {

    var response = await get({url: `network/earliest-onstream-date/${assetGroupId}/${networkName}`});

    return response;
}