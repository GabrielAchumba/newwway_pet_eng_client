import { assetGroups } from "src/temp_database/asset_groups/asset_groups_bk";
import {
  get,
  remove,
  post,
  put,
  uploadPhoto,
  https
} from "src/httpservices/services";


export const fetchUnits = async (assetGroupId) => {

    var response = await get({url: `units/find-units/${assetGroupId}`});
    //console.log(response)
    return response.data;
}