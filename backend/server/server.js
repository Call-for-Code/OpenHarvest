const IBMCloudEnv = require('ibm-cloud-env');
IBMCloudEnv.init('/config/mappings.json');

// Setup env for ibm cloud cloudant sdk
process.env['CLOUDANT_URL'] = IBMCloudEnv.getString('cloudant_url');
process.env['CLOUDANT_APIKEY'] = IBMCloudEnv.getString('cloudant_apikey');

// import dependencies and initialize express
const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');

// const nameRoutes = require('./routes/names-route.js');
// const healthRoutes = require('./routes/health-route.js');
const farmerRoutes = require('./routes/farmer-route.js');
const authRoutes = require('./routes/auth-route.js');
const lotRoutes = require('./routes/lot-route');
const cropRoutes = require('./routes/crop-route');

const app = express();

app.use(cors());

// enable parsing of http request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable session
app.use(session({
  secret: 'test',
  resave: true,
  saveUninitialized: true}));

// if production, enable helmet
/* istanbul ignore if  */
if (process.env.VCAP_APPLICATION) {
  app.use(helmet());
}

app.use(express.static(path.join('public')));

// routes and api calls
// app.use('/api', healthRoutes);
// app.use('/api/names', nameRoutes);

app.use('/api/farmer', farmerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/lot', lotRoutes);
app.use('/api/crop', cropRoutes);

// start node server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App UI available http://localhost:${port}`);
});

// error handler for unmatched routes or api calls
app.use((req, res, next) => {
  res.status(404);
});

module.exports = app;
