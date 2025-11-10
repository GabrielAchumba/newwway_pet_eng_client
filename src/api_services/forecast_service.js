import { assetGroups } from "src/temp_database/asset_groups/asset_groups_bk";
import {
  get,
  remove,
  post,
  put,
  uploadPhoto,
  https
} from "src/httpservices/services";



export const runForecastRequest = async (payload)  => {
    
    try {
        var response = await post({
            url: "forecast/run-forecast",
            req: payload
        });

        return response;

    } catch (error) {

        //console.log("error: ", error)
        return error;
    }
}