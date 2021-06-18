const { CloudantV1 } = require("@ibm-cloud/cloudant");
const client = CloudantV1.newInstance({});

module.exports = client;
