// const {client} = require("../db/cloudant");
// const {cropDetailsView} = require("../db/cloudant");
// const {cropDetailsDdoc} = require("../db/cloudant");

import { CropModel, Crop } from "./../db/entities/crop";

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
        const cropModel = new CropModel(crop);

        const savedDoc = await cropModel.save();
        return savedDoc;
    }

    getCrop(id: string) {
        return CropModel.findById(id);
    }

    async deleteCrop(id: string) {
        const result = await CropModel.deleteOne({_id: id}).exec();
        return result;
    }
}

// module.exports = CropService;
