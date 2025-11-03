import { liquidVolume } from "./liquidVolume";
import { gasVolume } from "./gasVolume";
import { liquidRate } from "./liquidRate";
import { gasRate } from "./gasRate";
import { glr } from "./glr";
import { lgr } from "./lgr";
import { declineRate } from "./declineRate";

export const unitNames = [
    {unitName: "Cumulative Oil Production", inputOptions: [...liquidVolume.options], outputOptions: [...liquidVolume.options], quantity: "liquidVolume"},
    {unitName: "Cumulative Condensate Production", inputOptions: [...liquidVolume.options], outputOptions: [...liquidVolume.options], quantity: "liquidVolume"},
    {unitName: "Cumulative Gas Production", inputOptions: [...gasVolume.options], outputOptions: [...gasVolume.options], quantity: "gasVolume"},
    {unitName: "Cumulative Water Production", inputOptions: [...liquidVolume.options], outputOptions: [...liquidVolume.options], quantity: "liquidVolume"},
    {unitName: "Cumulative Liquid Production", inputOptions: [...liquidVolume.options], outputOptions: [...liquidVolume.options], quantity: "liquidVolume"},
    {unitName: "Oil Rate", inputOptions: [...liquidRate.options], outputOptions: [...liquidRate.options], quantity: "liquidRate"},
    {unitName: "Condensate Rate", inputOptions: [...liquidRate.options], outputOptions: [...liquidRate.options], quantity: "liquidRate"},
    {unitName: "Gas Rate", inputOptions: [...gasRate.options], outputOptions: [...gasRate.options], quantity: "gasRate"},
    {unitName: "Water Rate", inputOptions: [...liquidRate.options], outputOptions: [...liquidRate.options], quantity: "liquidRate"},
    {unitName: "Liquid Rate", inputOptions: [...liquidRate.options], outputOptions: [...liquidRate.options], quantity: "liquidRate"},
    {unitName: "Ultimate Oil Recovery", inputOptions: [...liquidVolume.options], outputOptions: [...liquidVolume.options], quantity: "liquidVolume"},
    {unitName: "Ultimate Gas Recovery", inputOptions: [...gasVolume.options], outputOptions: [...gasVolume.options], quantity: "gasVolume"},
    {unitName: "GOR/GLR", inputOptions: [...glr.options], outputOptions: [...glr.options], quantity: "glr"},
    {unitName: "CGR/WGR", inputOptions: [...lgr.options], outputOptions: [...lgr.options], quantity: "lgr"},
    {unitName: "Decline Rate", inputOptions: [...declineRate.options], outputOptions: [...declineRate.options], quantity: "declineRate"}
];