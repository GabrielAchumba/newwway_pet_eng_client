import { assetGroups } from "src/temp_database/asset_groups/asset_groups_bk";
import {
  get,
  remove,
  post,
  put,
  uploadPhoto,
  https
} from "src/httpservices/services";


export const fetchAssetGroups = async () => {

    var response = await get({url: "asset-groups"});
    return response.data;
}

export const createAssetGroup = async (newAssetGroup)  => {
    
    try {
        var response = await post({
            url: "asset-groups",
            req: newAssetGroup
        });

        return response;

    } catch (error) {

        console.log("error: ", error)
        return error;
    }
}