import { assetGroups } from "src/temp_database/asset_groups/asset_groups_bk";
import {
  get,
  remove,
  post,
  put,
  uploadPhoto,
  https
} from "src/httpservices/services";




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

export const findLiftCurvesNamesPerDrainagePoint = async (payload)  => {
    
    try {
        var response = await get({
            url: `vlp/lift-curves-names/${payload.drainagePointId}/${payload.assetGroupId}`,
            req: payload
        });

        return response;

    } catch (error) {

        //console.log("error: ", error)
        return error;
    }
}

export const findOneLiftCurves = async (payload)  => {
    
    try {
        var response = await get({
            url: `vlp/lift-curves/${payload.liftCurveName}`,
            req: payload
        });

        return response;

    } catch (error) {

        //console.log("error: ", error)
        return error;
    }
}

export const calculateVLP = async (payload) => {
    
    try {
        var response = await post({
            url: `vlp/calculate-vlp-curve`,
            req: payload
        });

        return response;

    } catch (error) {

        //console.log("error: ", error)
        return error;
    }

}