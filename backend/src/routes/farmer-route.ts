import { Router, Request, Response } from "express";
import { EISField } from "../integrations/EIS/EIS.types";
import { EISAPIService } from "../integrations/EIS/EIS-api.service";
import { Farmer, FarmerModel } from "../db/entities/farmer";
import { Field, FieldModel } from "../db/entities/field";
import { center, bbox, area, bboxPolygon } from "@turf/turf";
import { FeatureCollection } from "geojson";
import { kmsAuth } from "../integrations/Blockchain/web3/authentication-functions";

const EISKey = process.env.EIS_apiKey;

if (EISKey == undefined) {
    console.error("You must define 'EIS_apiKey' in the environment!");
    process.exit(-1);
}

const eisAPIService = new EISAPIService(EISKey);

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const docs = await FarmerModel.find().lean().exec();
        res.json(docs);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

async function createOrUpdateFarmer(req: Request, res: Response) {
    const farmer = req.body;
    if (!farmer) {
        res.sendStatus(400).end();
        return;
    }
    try {
        const farmerDoc = new FarmerModel(farmer);
        const updatedDoc = farmerDoc.save();
        res.json(updatedDoc);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }

}

async function getFarmer(id: string) {
    // Aggregate with land areas eventually
    const farmer = await FarmerModel.findById(id).lean().exec();
    if (farmer == null) {
        return null;
    }
    
    // Get Fields
    // const field = await eisAPIService.getFarmerField(id);
    const fields = await FieldModel.find({farmer_id: id});
    if (fields.length === 0) {
        throw new Error("Farmer missing Field!");
    }
    farmer.field = fields[0];

    return farmer;
}

router.post("/", createOrUpdateFarmer);

router.put("/", createOrUpdateFarmer);

router.get("/:id", async (req: Request, res: Response) => {
    const id = req.params["id"];
    if (!id) {
        res.sendStatus(400).end();
        return;
    }

    try {
        const farmer = await getFarmer(id);
        if (farmer == null) {
            res.status(404).end();
        }
        else {
            res.json(farmer);
        }
        
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

// Delete Farmer
router.delete("/:id", async(req: Request, res: Response) => {
    const id = req.params["id"];
    if (!id) {
        res.sendStatus(400).end();
        return;
    }
    try {
        const result = await FarmerModel.deleteOne({_id: id});
        res.json(result);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

export interface FarmerAddDTO {
    farmer: Farmer;
    // field: EISField
    field: Field
}

// Create Pub/Priv key on AWS KMS using the FarmerId as alias
const createEthAccount = async(farmerId: String) => {
    
    //Authenticate
    const kms = kmsAuth();
    
    //Create Key
    const cmk = await kms.createKey({
        KeyUsage : 'SIGN_VERIFY',
        KeySpec : 'ECC_SECG_P256K1',
    }).promise();

    // Assign farmerId as alias of created key
    const keyId = cmk.KeyMetadata.KeyId;
    const aliasResponse = await kms.createAlias({
        AliasName : "alias/" + farmerId,
        TargetKeyId : keyId
    }).promise();

    //Grant the application user IAM role permissions on the new key
    const grantResponse = await kms.createGrant({
        KeyId : keyId,
        GranteePrincipal : process.env.OPEN_HARVEST_APPLICATION_USER_ARN,
        Operations : ['GetPublicKey', 'Sign']
    }).promise();

    return keyId;
}

router.post("/add", async(req: Request, res: Response) => {
    const {farmer, field}: FarmerAddDTO = req.body;
    if (farmer == undefined) {
        res.status(400).send("Farmer not defined");
        return;
    }
    if (field == undefined) {
        res.status(400).send("Field not defined");
        return;
    }
    // First we'll create the farmer
    const farmerDoc = new FarmerModel(farmer);
    let newFarmer = await farmerDoc.save();

    if (newFarmer._id == undefined) {
        throw new Error("Farmer ID is not defined after saving!")
    }

    // Then we'll create the Field
    field.farmer_id = newFarmer._id.toHexString();

    //Create and set ethAccount keyID to the farmer object
    const farmerKeyId = await createEthAccount(field.farmer_id);
    farmerDoc.ethKeyID = farmerKeyId;
    await farmerDoc.save();
      

    // Lets populate some of the field information

    // Subfield area, centre and Bbox
    for (let i = 0; i < field.subFields.length; i++) {
        const subField = field.subFields[i];
        subField.properties.area = area(subField);
        const centreFeature = center(subField);
        subField.properties.centre = {
            lat: centreFeature.geometry.coordinates[1],
            lng: centreFeature.geometry.coordinates[0],
        }
        const bboxCalc = bbox(subField);
        subField.properties.bbox = {
            northEast: {lat: bboxCalc[1], lng: bboxCalc[0]},
            southWest: {lat: bboxCalc[3], lng: bboxCalc[2]}
        }
    }

    // Field bbox, centre
    const fieldFeatureCollection: FeatureCollection<any, any> = {
        type: "FeatureCollection",
        features: field.subFields
    };
    const centreFeature = center(fieldFeatureCollection);
    const bboxCalc = bbox(fieldFeatureCollection);
    field.centre = {
        lat: centreFeature.geometry.coordinates[1],
        lng: centreFeature.geometry.coordinates[0],
    }
    field.bbox = {
        northEast: {lat: bboxCalc[1], lng: bboxCalc[0]},
        southWest: {lat: bboxCalc[3], lng: bboxCalc[2]}
    }

    const fieldDoc = new FieldModel(field);
    const newField = await fieldDoc.save();

    const farmerObj = newFarmer.toObject();

    farmerObj.field = newField.toObject() as Field;

    res.json(farmerObj);
});

export default router;
// module.exports = router;
