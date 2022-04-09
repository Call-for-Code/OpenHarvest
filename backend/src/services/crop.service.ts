// const {client} = require("../db/cloudant");
// const {cropDetailsView} = require("../db/cloudant");
// const {cropDetailsDdoc} = require("../db/cloudant");

import { CropModel, Crop } from "../db/entities/crop";

// const APPLICATION_DB = "application-db";
// const db = APPLICATION_DB;

// const LOT_DB = "lot-areas";
let cropDetails;

export default class CropService {

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

// module.exports = CropService;
