require('dotenv').config()

const fs = require("fs");

const { CloudantV1 } = require("@ibm-cloud/cloudant");
const client = CloudantV1.newInstance({});

const APPLICATION_DB = "application-db";

const data = JSON.parse(fs.readFileSync("data.json", 'utf8'));

async function checkIfDatabaseAlreadyExists() {
    const dbsRes = await client.getAllDbs();
    return dbsRes.result.includes(APPLICATION_DB);
}

async function main() {

    if (await checkIfDatabaseAlreadyExists()) {
        console.log("Database already exists, exiting");
        process.exit(0);
    }

    await client.putDatabase({
        db: APPLICATION_DB,
        partitioned: true
    });

    console.log("Creating documents");
    console.log(data);

    await client.postBulkDocs({
        db: APPLICATION_DB,
        bulkDocs: {
            docs: data
        }
    });

}

main();


// var data = {
//     "farmer": {
//         "_id": "farmer:<CLOUDANT_UUID>",
//         "type": "farmer",
//         "name": "Ryan Pereira",
//         "mobile": "+91213432134",
//         "land_ids": [
//             121,
//             2331,
//             33232,
//             33423,
//             1324
//         ]
//     },
//     "lot": {
//         "_id": "lot:111",
//         "type": "lot",
//         "fid": 111,
//         "crops_planted": [
//             {
//                 "_id": "crop:2",
//                 "type": "crop",
//                 "name": "Test Crop",
//                 "planted": "2021-06-11T00:37:03.496Z",
//                 "harvested": "2021-06-15T00:37:03.496Z",
//                 "farmer": "uuid"
//             },
//             {
//                 "_id": "crop:1",
//                 "type": "crop",
//                 "name": "Rice",
//                 "planted": "2021-06-11T00:37:03.496Z",
//                 "harvested": null,
//                 "farmer": "uuid"
//             }
//         ]
//     },
//     "crop": {
//         "_id": "crop:1",
//         "type": "crop",
//         "name": "Rice",
//         "planting_season": [
//             "2021-06-11T00:37:03.496Z",
//             "2021-06-11T00:37:03.496Z"
//         ],
//         "time_to_harvest": 30
//     }
// }
