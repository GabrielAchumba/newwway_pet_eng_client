import { assetGroups } from "src/temp_database/asset_groups/asset_groups_bk";
import {
  get,
  remove,
  post,
  put,
  uploadPhoto,
  https
} from "src/httpservices/services";


// export const fetchAssetGroups = async () => {

//     var response = await get({url: "asset-groups"});
//     //console.log(response)
//     return response.data;
// }

export const createLiftCurves = async (payload)  => {
    
    try {
        var response = await post({
            url: "vlp/create-lift-curves",
            req: payload
        });

        return response;

    } catch (error) {

        //console.log("error: ", error)
        return error;
    }
}