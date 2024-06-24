import { Router, Request, Response } from "express";
import { Field, FieldModel } from "../db/entities/field";

const router = Router();

router.get("/getFieldByFarmerId/:farmer_id", async(req: Request, res: Response) => {
    try{
        const docs = await FieldModel.findOne({farmer_id: req.params.farmer_id})
        .then(doc => {
            return doc;
        })
        .catch(err => {
            return err;
           })
           res.json(docs);
    }catch(e){
        console.error(e);
        res.status(500).json(e);
    }
});

export default router;