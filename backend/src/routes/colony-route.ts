import { Request, Response, Router } from "express";
import { gnosisConnection } from "../integrations/Blockchain/web3/authentication-functions";
import { AwsKmsSigner } from "../integrations/Blockchain/web3/AwsKmsSigner";
import { ColonyNetwork } from '@colony/sdk';
import { getReputationReport } from "../integrations/Blockchain/web3/helper-functions";
import { FarmerModel } from "../db/entities/farmer";

var router = Router();

router.post("/", getReputationForFarmer);

// This route expects a Farmer ID string. The farmer Id will be used to retrieve the Farmer object.
// The farmer object's ethKeyID will be used to get the farmer's ethAddress and reputation.
async function getReputationForFarmer(req: Request, res: Response){
    try{
        // get farmer object
        const farmer = await FarmerModel.findById(req.body.farmer_id).lean().exec();

        if(!farmer){
            throw new Error("Farmer not found.");
        }else{
            // connect to Gnosis network with Farmer account
            const provider = gnosisConnection();
            const farmerSigner = new AwsKmsSigner(farmer!.ethKeyID, provider);
            const farmerEthAddress = await farmerSigner.getAddress();
            
            // connect to Heifer colony and retrieve farmer rep and HX balance
            const colonyNetwork = new ColonyNetwork(farmerSigner);
            const colony = await colonyNetwork.getColony(process.env.HEIFER_COLONY_CONTRACT_ADDRESS!);
            const balance = await colony.getBalance();
            const reputation = await colony.getReputation(farmerEthAddress);
            res.json({
                colony_balance : balance.toString(),
                reputation : reputation.toString(),
                farmer_eth_address: farmerEthAddress,
                reputation_report : getReputationReport(req.body)
            });
        }
        
    }catch(e){
        console.error(e);
        res.status(500).json(e);
    }
}

export default router;