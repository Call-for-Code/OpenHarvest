// const {client} = require("../db/cloudant");
// const {cropDetailsView} = require("../db/cloudant");
// const {cropDetailsDdoc} = require("../db/cloudant");

import { Crop } from "../../../common-types/src";
import { CropModel } from "../db/entities/crop";

export class CropService {

    constructor() {
    }

    getAllCrops() {
        return CropModel.find();
    }

    async saveOrUpdate(crop: Crop) {
        if (crop._id) {
            return CropModel.updateOne(crop);
        }

        return await new CropModel(crop).save();
    }

    getCrop(id: string) {
        return CropModel.findById(id);
    }

    async deleteCrop(id: string) {
        return await CropModel.deleteOne({_id: id}).exec();
    }
}

export const cropService = new CropService();
