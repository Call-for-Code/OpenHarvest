const IBMCloudEnv = require("ibm-cloud-env");
IBMCloudEnv.init("/config/mappings.json");

// Setup env for ibm cloud cloudant sdk
const cloudEnvUrl = IBMCloudEnv.getString("cloudant_url");
const cloudEnvApiKey = IBMCloudEnv.getString("cloudant_apikey");

if (cloudEnvUrl && cloudEnvApiKey && (process.env["USE_CLOUDANT_ENV"] == undefined || process.env["USE_CLOUDANT_ENV"] === "false")) {
    process.env["CLOUDANT_URL"] = cloudEnvUrl;
    process.env["CLOUDANT_APIKEY"] = cloudEnvApiKey;
}

console.log("CLOUDANT_URL", process.env["CLOUDANT_URL"]);
console.log("CLOUDANT_APIKEY", process.env["CLOUDANT_APIKEY"]);



// import dependencies and initialize express
const express = require("express");
const session = require("express-session");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const farmerRoutes = require("./routes/farmer-route.js");
const authRoutes = require("./routes/auth-route.js");
const lotRoutes = require("./routes/lot-route");
const cropRoutes = require("./routes/crop-route");
const dashboardRoutes = require("./routes/dashoboard-route");
const recommendationsRoutes = require("./routes/recommendations-route");

const app = express();

app.use(cors());

// enable parsing of http request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable session
app.use(session({
    secret: "test",
    resave: true,
    saveUninitialized: true}));

// if production, enable helmet
/* istanbul ignore if  */
if (process.env.VCAP_APPLICATION) {
    app.use(helmet());
}

app.use(express.static(path.join("public")));

// routes and api calls
// app.use('/api', healthRoutes);
// app.use('/api/names', nameRoutes);

app.use("/api/farmer", farmerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/lot", lotRoutes);
app.use("/api/crop", cropRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/recommendations", recommendationsRoutes);

// start node server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App UI available http://localhost:${port}`);
});

// error handler for unmatched routes or api calls
app.use((req, res) => {
    res.status(404);
});

module.exports = app;
