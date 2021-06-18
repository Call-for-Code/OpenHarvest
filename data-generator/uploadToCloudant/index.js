const axios = require("axios").default;
const fs = require("fs");

async function getToken(apikey) {
    const params = {
        grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
        apikey
    };

    const data = Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');

    const options = {
        method: 'POST',
        url: 'https://iam.cloud.ibm.com/identity/token',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        data 
    };

    const res = await axios.request(options);
    const token = res.data.access_token;
    return token;
}


async function main() {

    const key = fs.readFileSync("apiKey.txt", 'utf8');
    
    // Getting Token
    console.log("Getting Token");
    let token;
    try {
        token = await getToken(key);
        console.log("Token:", token);
    }
    catch (e) {
        console.error("Failed to get token");
        process.exit(-1);
    }

    // Read file
    console.log("Reading File...");
    const data = JSON.parse(fs.readFileSync("./../output/features.json", 'utf8'));

    // set _id's for all records
    console.log("Matching _id and fid");
    for (let i = 0; i < data.length; i++) {
        data[i]._id = "" + data[i].properties.fid;
    }

    const chunkSize = 1000;

    // Calculate number of Chunks
    let chunksSent = 0;
    const numChunks = Math.ceil(data.length / chunkSize);


    // Collect 500 documents and send it in bulk

    console.log(`Sending Data in ${chunkSize} sized chunks`);

    var i, j, temparray;
    // const requestArray = [];
    for (i = 0, j = data.length; i < j; i += chunkSize) {
        temparray = data.slice(i, i + chunkSize);
        
        const options = {
            method: 'POST',
            url: 'https://9c6d0ad3-d24f-4c34-ad3c-9efbc0209d29-bluemix.cloudantnosqldb.appdomain.cloud/lot-areas/_bulk_docs',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: {
                docs: temparray
            }
        };

        // console.log(options.data.docs[0]);
        // process.exit();

        const percentage = (chunksSent / numChunks) * 100;
        console.log(`Sending Chunk: ${i}. ${chunksSent}/${numChunks} Chunks Sent. ${percentage.toFixed(0)}%`);

        await axios.request(options);

        chunksSent++;
    }
}

main();

