const { CloudantV1 } = require("@ibm-cloud/cloudant");
const client = CloudantV1.newInstance({});

const plantedCrops = "plantedCrops";
const LOT_DB = "lot-areas";

// client.postAllDocs({
//     db: LOT_DB,
//     includeDocs: true,
//     limit: 10,
// }).then(response => {
//     console.log(response.result.rows.map(f => f.doc.properties.data.crops_planted));
// }).catch((e) => console.log(e));

client.headDesignDocument({
    db: LOT_DB,
    ddoc: plantedCrops,
}).then(() => {
    console.log(plantedCrops + " view already exists: ");
    // const rev = response.headers["etag"].replace("\"", "").replace("\"", "");
    // client.deleteDesignDocument({
    //     db: LOT_DB,
    //     ddoc: plantedCrops,
    //     rev: rev,
    // }).then(response => {
    // getOverallCropDistribution();
    // createOverallCropDistributionView();
    // }).catch(reason => console.log(reason));
}).catch(e => {
    if (e.status === 404) {
        createOverallCropDistributionView();
    } else {
        console.log(e);
    }
});


function createOverallCropDistributionView() {
    const overallCropDistributionMap = {
        map: "function(doc) {" +
            "    if (doc.properties && doc.properties.data && doc.properties.data.crops_planted) {\n" +
            "        var len = doc.properties.data.crops_planted.length; " +
            "        var plantedCrop; " +
            "        for(var i=0; i < len; i++) { " +
            "            if (doc.properties.data.crops_planted[i].harvested == null) { plantedCrop = doc.properties.data.crops_planted[i]; break;} " +
            "        }\n" +
            "        if (plantedCrop) {\n" +
            "            emit(plantedCrop.crop.name, doc.properties.Area_Ha);\n" +
            "        } else {\n" +
            "            emit('Empty', doc.properties.Area_Ha);\n" +
            "        }\n" +
            "    } else {\n" +
            "        emit('Empty', doc.properties.Area_Ha);\n" +
            "    }" +
            "}",
        reduce: "_sum",
    };

    const designDoc = {
        views: {cropPlantedArea: overallCropDistributionMap},
        // indexes: {cropPlantedArea: cropIndex},
    };

    client.putDesignDocument({
        db: LOT_DB,
        designDocument: designDoc,
        ddoc: plantedCrops,
    }).then(response => {
        console.log(plantedCrops + " view is created: ", response.result);
        // getOverallCropDistribution();
    }).catch((e) => console.log(e));
}


module.exports = {
    client,
    plantedCrops,
}
//module.exports = plantedCrops;
