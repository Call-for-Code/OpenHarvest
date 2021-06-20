const axios = require("axios").default;
const fs = require("fs");
const centreOfMass = require("@turf/center-of-mass").default;

const crops = JSON.parse(fs.readFileSync("crop-data.json", 'utf8'));

function randomCrop(crops) {
    return crops[Math.floor(Math.random()*crops.length)];
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function subtractDate(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

    const currDate = new Date();
    const currMonth = currDate.getMonth();

    // set _id's for all records
    console.log("Matching _id and fid");
    for (let i = 0; i < data.length; i++) {
        data[i]._id = "" + data[i].properties.fid;
        delete data[i].properties.Crop;
        
        // get in season crops
        // const seasonCrops = crops.filter(it => {
        //     const [start, end] = it.planting_season;
        //     // If it rolls over the year
        //     if (end < start) {
        //         return (currMonth >= start || currMonth <= end)
        //     }
        //     else {
        //         return currMonth >= start && currMonth <= end;
        //     }
        // });

        const selectedCrop = randomCrop(crops);

        // const startPlantingDate = new Date(currDate.getFullYear(), selectedCrop.planting_season[0], 1);
        // const actualPlantedDate = addDays(startPlantingDate, getRandomInt(0, 45)); // Generate a random planted date

        const startPlanting = subtractDate(new Date(), selectedCrop.time_to_harvest);
        const actualPlantedDate = addDays(startPlanting, getRandomInt(0, selectedCrop.time_to_harvest)); // Generate a random planted date
        
        // Calculate Centre
        const centre = centreOfMass(data[i]);
        

        data[i].properties.data = {
            Area_Ha: data[i].properties.Area_Ha,
            centre: centre.geometry,
            crops_planted: [{
                name: selectedCrop.name,
                planted: actualPlantedDate,
                harvested: null,
                crop: selectedCrop
            }]
        }

        // console.log(data[i].properties.data);
        // process.exit();
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

