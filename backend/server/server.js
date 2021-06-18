const IBMCloudEnv = require('ibm-cloud-env');
IBMCloudEnv.init('/config/mappings.json');

// Setup env for ibm cloud cloudant sdk
process.env['CLOUDANT_URL'] = IBMCloudEnv.getString('cloudant_url');
process.env['CLOUDANT_APIKEY'] = IBMCloudEnv.getString('cloudant_apikey');

// import dependencies and initialize express
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');

// const nameRoutes = require('./routes/names-route.js');
// const healthRoutes = require('./routes/health-route.js');
const farmerRoutes = require('./routes/farmer-route.js');
const lotRoutes = require('./routes/lot-route');
const cropRoutes = require('./routes/crop-route');

const app = express();

app.use(cors())

// enable parsing of http request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// if production, enable helmet
/* istanbul ignore if  */
if (process.env.VCAP_APPLICATION) {
  app.use(helmet());
}

// access to static files
app.use(express.static(path.join('public')));

// routes and api calls
// app.use('/health', healthRoutes);
// app.use('/api/names', nameRoutes);

app.use('/farmer', farmerRoutes);
app.use('/lot', lotRoutes);
app.use('/crop', cropRoutes);

// start node server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App UI available http://localhost:${port}`);
});

// error handler for unmatched routes or api calls
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, '../public', '404.html'));
});

module.exports = app;
