import { Request, Response, Router } from "express";
import { gnosisConnection } from "../web3/authentication-functions";
import { AwsKmsSigner } from "../web3/AwsKmsSigner";
import { ColonyNetwork } from '@colony/sdk';

var router = Router();

router.get("/", getReputationForFarmer);

// This route expects a Farmer object. The ethKeyID will be used to get the farmer's
// ethAddress and reputation.
async function getReputationForFarmer(req: Request, res: Response){
    // connect to Gnosis network with Farmer account
    const provider = gnosisConnection();
    const farmerSigner = new AwsKmsSigner(req.body.farmer.ethKeyID, provider);
    const farmerEthAddress = await farmerSigner.getAddress();
    
    // connect to Heifer colony and retrieve farmer rep and HX balance
    const colonyNetwork = new ColonyNetwork(farmerSigner);
    const colony = await colonyNetwork.getColony(process.env.HEIFER_COLONY_CONTRACT_ADDRESS!);
    const balance = await colony.getBalance();
    const reputation = await colony.getReputation(farmerEthAddress);
    res.json({
        colony_balance : balance.toString(),
        reputation : reputation.toString(),
        farmer_eth_address: farmerEthAddress
    });
}

export default router;