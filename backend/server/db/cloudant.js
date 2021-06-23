const { CloudantV1 } = require("@ibm-cloud/cloudant");
const client = CloudantV1.newInstance({});

const plantedCrops = "plantedCrops";
const cropProductionForecast = "cropProductionForecast";
const cropProductionHistory = "cropProductionHistory";
const APPLICATION_DB = "application-db";
const LOT_DB = "lot-areas";
//
// client.postAllDocs({
//     db: LOT_DB,
//     includeDocs: true,
//     limit: 10,
// }).then(response => {
//     console.log(response.result.rows.map(f => f.doc.properties.data.crops_planted[0]));
// }).catch((e) => console.log(e));

client.headDesignDocument({
    db: LOT_DB,
    ddoc: plantedCrops,
}).then((response) => {
    console.log(plantedCrops + " view already exists: ", response.status);
    // const rev = response.headers["etag"].replace("\"", "").replace("\"", "");
    // client.deleteDesignDocument({
    //     db: LOT_DB,
    //     ddoc: plantedCrops,
    //     rev: rev,
    // }).then(response => {
    // // getOverallCropDistribution();
    //     createOverallCropDistributionView();
    // }).catch(reason => console.log(reason));
}).catch(e => {
    if (e.status === 404) {
        createOverallCropDistributionView();
    } else {
        console.log(e);
    }
});

const plantedAreaView = "cropPlantedArea";
const cropProductionByMonthView = "cropProductionByMonth";

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
        // client.postView({
        //     db: LOT_DB,
        //     ddoc: plantedCrops,
        //     view: plantedAreaView,
        //     group: true,
        // }).then(response => {
        //     console.log(response.result.rows);
        // }).catch(e => console.log(e));
    }).catch((e) => console.log(e));
}

client.headDesignDocument({
    db: LOT_DB,
    ddoc: cropProductionForecast,
}).then((response) => {
    console.log(cropProductionForecast + " view already exists: ", response.status);
    // const rev = response.headers["etag"].replace("\"", "").replace("\"", "");
    // client.deleteDesignDocument({
    //     db: LOT_DB,
    //     ddoc: cropProductionForecast,
    //     rev: rev,
    // }).then(response => {
    //     // getOverallCropDistribution();
    //     createCropProductionForecastView();
    // }).catch(reason => console.log(reason));
}).catch(e => {
    if (e.status === 404) {
        createCropProductionForecastView();
    } else {
        console.log(e);
    }
});

function createCropProductionForecastView() {
    const map = {
        map: "function(doc) {" +
            "    if (doc.properties && doc.properties.data && doc.properties.data.crops_planted) {\n" +
            "        var len = doc.properties.data.crops_planted.length; " +
            "        var plantedCrop; " +
            "        for(var i=0; i < len; i++) { " +
            "            if (doc.properties.data.crops_planted[i].harvested == null) { plantedCrop = doc.properties.data.crops_planted[i]; break;} " +
            "        }\n" +
            "        if (plantedCrop) {\n" +
            "            var d = new Date(plantedCrop.planted); d.setHours(0,0,0,0); " +
            "            d.setDate(d.getDate() + plantedCrop.crop.time_to_harvest);" +
            // "            emit([new Date(d.getFullYear(), d.getMonth(), 1), plantedCrop.crop.name], doc.properties.Area_Ha * plantedCrop.crop.yield /10000);\n" +
            "            emit([d, plantedCrop.crop.name], doc.properties.Area_Ha * plantedCrop.crop.yield /10000);\n" +
            "        }\n" +
            "    }" +
            "}",
        reduce: "_sum",
    };

    const designDoc = {
        views: {cropProductionByMonth: map},
    };

    client.putDesignDocument({
        db: LOT_DB,
        designDocument: designDoc,
        ddoc: cropProductionForecast,
    }).then(response => {
        console.log(cropProductionForecast + " view is created: ", response.result);
        // client.postView({
        //     db: LOT_DB,
        //     ddoc: cropProductionForecast,
        //     view: "cropProductionByMonth",
        //     groupLevel: 2,
        // }).then(response => {
        //     console.log(response.result.rows);
        // }).catch(e => console.log(e));
    }).catch((e) => console.log(e));
}

const cropDetailsDdoc = "cropDetails";
const cropDetailsView = "cropDetailsView";

client.headDesignDocument({
    db: LOT_DB,
    ddoc: cropDetailsDdoc,
}).then((response) => {
    console.log(cropDetailsDdoc + " view already exists: ", response.status);
    // const rev = response.headers["etag"].replace("\"", "").replace("\"", "");
    // client.deleteDesignDocument({
    //     db: LOT_DB,
    //     ddoc: cropDetails,
    //     rev: rev,
    // }).then(response => {
    //     createCropDetailsView();
    // }).catch(reason => console.log(reason));
}).catch(e => {
    if (e.status === 404) {
        createCropDetailsView();
    } else {
        console.log(e);
    }
});

function createCropDetailsView() {
    const cropMap = {
        map: "function(doc) {" +
            "    if (doc.properties && doc.properties.data && doc.properties.data.crops_planted) {\n" +
            "        var len = doc.properties.data.crops_planted.length; " +
            "        for(var i=0; i < len; i++) { " +
            "            var plantedCrop = doc.properties.data.crops_planted[i];" +
            "            emit(plantedCrop.crop.name, plantedCrop.crop);" +
            "        }\n" +
            "    }\n" +
            "}",
        reduce: "function(keys, values) {\n" +
            "  return values[0];\n" +
            "}",
    };

    const designDoc = {
        views: {cropDetailsView: cropMap},
        // indexes: {cropPlantedArea: cropIndex},
    };

    client.putDesignDocument({
        db: LOT_DB,
        designDocument: designDoc,
        ddoc: cropDetailsDdoc,
    }).then(response => {
        console.log(cropDetailsDdoc + " view is created: ", response.result);
        // client.postView({
        //     db: LOT_DB,
        //     ddoc: cropDetails,
        //     view: cropDetailsView,
        //     group: true,
        // }).then(response => {
        //     console.log(response.result.rows);
        // }).catch(e => console.log(e));
    }).catch((e) => console.log(e));
}

//Tile Views

const farmerCountDoc = "farmerCountDoc";
const farmerCountView = "farmerCountView";

client.headDesignDocument({
    db: APPLICATION_DB,
    ddoc: farmerCountDoc,
}).then((response) => {
    console.log(farmerCountDoc + " view already exists: ", response.status);
    // const rev = response.headers["etag"].replace("\"", "").replace("\"", "");
    // client.deleteDesignDocument({
    //     db: LOT_DB,
    //     ddoc: cropDetails,
    //     rev: rev,
    // }).then(response => {
    //     createCropDetailsView();
    // }).catch(reason => console.log(reason));
}).catch(e => {
    if (e.status === 404) {
        createTotalFarmersView();
    } else {
        console.log(e);
    }
});

const farmerMapView = function (doc) {
    if (doc.type == "farmer") {
        emit('count', 1);
    }
};

function createTotalFarmersView() {
    const map = {
        map: farmerMapView.toString(),
        reduce: "_count",
    };

    const designDoc = {
        views: { farmerCountView: map},
    };

    client.putDesignDocument({
        db: APPLICATION_DB,
        designDocument: designDoc,
        ddoc: farmerCountDoc,
    }).then(response => {
        console.log(farmerCountView + " view is created: ", response.result);
        // client.postView({
        //     db: LOT_DB,
        //     ddoc: totalFarmersTile,
        //     view: "totalFarmers",
        //     groupLevel: 2,
        // }).then(response => {
        //     console.log(response.result.rows);
        // }).catch(e => console.log(e));
    }).catch((e) => console.log(e));
}

const cropsPlantedDoc = "cropsPlantedDoc";
const cropsPlantedView = "cropsPlantedView";

client.headDesignDocument({
    db: LOT_DB,
    ddoc: cropsPlantedDoc,
}).then((response) => {
    console.log(cropsPlantedDoc + " view already exists: ", response.status);
}).catch(e => {
    if (e.status === 404) {
        createCropsPlantedView();
    } else {
        console.log(e);
    }
});

const cropsPlantedViewFunc = function (doc) {
    var len = doc.properties.data.crops_planted.length;
    emit("Length", len);
}

function createCropsPlantedView() {
    const map = {
        map: cropsPlantedViewFunc.toString(),
        reduce: "_sum",
    };

    const designDoc = {
        views: { cropsPlantedView: map},
    };

    client.putDesignDocument({
        db: LOT_DB,
        designDocument: designDoc,
        ddoc: cropsPlantedDoc,
    }).then(response => {
        console.log(cropsPlantedView + " view is created: ", response.result);
    }).catch((e) => console.log(cropsPlantedView, e));
}

const cropsHarvestedDoc = "cropsHarvestedDoc";
const cropsHarvestedView = "cropsHarvestedView";

client.headDesignDocument({
    db: LOT_DB,
    ddoc: cropsHarvestedDoc,
}).then((response) => {
    console.log(cropsHarvestedView + " view already exists: ", response.status);
}).catch(e => {
    if (e.status === 404) {
        totalCropsHarvestedView();
    } else {
        console.log(e);
    }
});

const cropsHarvestedViewFunc = function (doc) {
    var crops = doc.properties.data.crops_planted;
    var count = 0;
    for (var i = 0; i < crops.length; i++) {
        if (crops[i].harvested != null) {
            count = count + 1;
        }
    }
    emit("harvested", count);
}

function totalCropsHarvestedView() {
    const map = {
        map: cropsHarvestedViewFunc.toString(),
        reduce: "_sum",
    };

    const designDoc = {
        views: { cropsHarvestedView: map},
    };

    client.putDesignDocument({
        db: LOT_DB,
        designDocument: designDoc,
        ddoc: cropsHarvestedDoc,
    }).then(response => {
        console.log(cropsHarvestedDoc + " view is created: ", response.result);
    }).catch((e) => console.log(cropsHarvestedView, e));
}


client.headDesignDocument({
    db: LOT_DB,
    ddoc: cropProductionHistory,
}).then((response) => {
    console.log(cropProductionHistory + " view already exists: ", response.status);
    // const rev = response.headers["etag"].replace("\"", "").replace("\"", "");
    // client.deleteDesignDocument({
    //     db: LOT_DB,
    //     ddoc: cropProductionHistory,
    //     rev: rev,
    // }).then(response => {
    //     // getOverallCropDistribution();
    //     createCropProductionForecastView();
    // }).catch(reason => console.log(reason));
}).catch(e => {
    if (e.status === 404) {
        createCropProductionHistoryView();
    } else {
        console.log(e);
    }
});

function createCropProductionHistoryView() {
    const map = {
        map: "function(doc) {" +
            "    if (doc.properties && doc.properties.data && doc.properties.data.crops_planted) {\n" +
            "        var len = doc.properties.data.crops_planted.length; " +
            "        var plantedCrop; " +
            "        for(var i=0; i < len; i++) { " +
            "            if (doc.properties.data.crops_planted[i].harvested != null) { " +
            "                plantedCrop = doc.properties.data.crops_planted[i];  " +
            "                var d = new Date(plantedCrop.planted); d.setHours(0,0,0,0); " +
            "                d.setDate(d.getDate() + plantedCrop.crop.time_to_harvest);" +
            // "             emit([new Date(d.getFullYear(), d.getMonth(), 1), plantedCrop.crop.name], doc.properties.Area_Ha * plantedCrop.crop.yield /10000);\n" +
            "                emit([d, plantedCrop.crop.name], doc.properties.Area_Ha * plantedCrop.crop.yield /10000);\n" +
            "            }\n" +
            "        }\n" +
            "    }" +
            "}",
        reduce: "_sum",
    };

    const designDoc = {
        views: {cropProductionHistoryByMonth: map},
    };

    client.putDesignDocument({
        db: LOT_DB,
        designDocument: designDoc,
        ddoc: cropProductionHistory,
    }).then(response => {
        console.log(cropProductionHistory + " view is created: ", response.result);
        // client.postView({
        //     db: LOT_DB,
        //     ddoc: cropProductionHistory,
        //     view: "cropProductionHistoryByMonth",
        //     groupLevel: 2,
        // }).then(response => {
        //     console.log(response.result.rows);
        // }).catch(e => console.log(e));
    }).catch((e) => console.log(e));
}


module.exports = {
    client,
    plantedCrops,
    cropProductionForecast,
    cropProductionHistory,
    plantedAreaView,
    cropProductionByMonthView,
    cropDetailsDdoc,
    cropDetailsView,
    farmerCountDoc,
    farmerCountView,
    cropsPlantedDoc,
    cropsPlantedView,
    cropsHarvestedDoc,
    cropsHarvestedView,
};
