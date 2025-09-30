import { fields } from "src/temp_database/assets/fields_bk";
import {
  get,
  remove,
  post,
  put,
  uploadPhoto,
  https
} from "src/httpservices/services";

export const fetchFields = () => {
    return fields;
}

export const fetchAssets = async () => {

    var response = await get({url: "asset-groups"});
    return response.data;
}

export const createAssets = async (newAsset)  => {
    
    //console.log("newAsset: ", newAsset)
    try {
        var response = await post({
            url: "assets",
            req: newAsset
        });

        return response;

    } catch (error) {

        //console.log("error: ", error)
        return error;
    }
}

export const fetchAssetsByCategory = async (selectedAssetCategory, assetGroupId) => {

    console.log("selectedAssetCategory: ", selectedAssetCategory);
    console.log("assetGroupId: ", assetGroupId);

    var response = await get({url: `assets/${selectedAssetCategory}/${assetGroupId}`});
    return response.data;
}


export const generateNetwork = async (networkDto)  => {
    
    //console.log("networkDto: ", networkDto)
    try {
        var response = await post({
            url: "assets/generateNetwork",
            req: networkDto
        });

        return response;

    } catch (error) {

       // console.log("error: ", error)
        return error;
    }
}