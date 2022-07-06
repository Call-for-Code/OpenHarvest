//Authenticate with AWS KWS for key management
export const kmsAuth = () => {
    const AWS = require('aws-sdk');
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    });
    const kms = new AWS.KMS();
    return kms;
}

// connect to Gnosis network
export const gnosisConnection = () => {
    const ethers = require('ethers');
    const provider = new ethers.providers.JsonRpcProvider(process.env.GNOSIS_RPC_URL);
    return provider;
}