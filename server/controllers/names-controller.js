// import dependencies
const IBMCloudEnv = require('ibm-cloud-env');
IBMCloudEnv.init('/server/config/mappings.json');

// initialize Cloudant
const CloudantSDK = require('@cloudant/cloudant');
const cloudant = new CloudantSDK(IBMCloudEnv.getString('cloudant_url'));

// create mydb database if it does not already exist
cloudant.db.create('mydb')
  .then(data => {
    console.log('mydb database created');
  })
  .catch(error => {
    if (error.error === 'file_exists') {
      console.log('mydb database already exists');
    } else {
      console.log('Error occurred when creating mydb database', error.error);
    }
  });
const mydb = cloudant.db.use('mydb');

// get names from database
exports.getNames = (req, res, next) => {
  console.log('In route - getNames');
  return mydb.list({include_docs: true})
    .then(fetchedNames => {
      let names = [];
      let row = 0;
      fetchedNames.rows.forEach(fetchedName => {
        names[row] = {
          _id: fetchedName.id,
          name: fetchedName.doc.name,
          timestamp: fetchedName.doc.timestamp,
        };
        row = row + 1;
      });
      console.log('Get names successful');
      return res.status(200).json(names);
    })
    .catch(error => {
      console.log('Get names failed');
      return res.status(500).json({
        message: 'Get names failed.',
        error: error,
      });
    });
};

// add name to database
exports.addName = (req, res, next) => {
  console.log('In route - addName');
  let name = {
    name: req.body.name,
    timestamp: req.body.timestamp,
  };
  return mydb.insert(name)
    .then(addedName => {
      console.log('Add name successful');
      return res.status(201).json({
        _id: addedName.id,
        name: addedName.name,
        timestamp: addedName.timestamp,
      });
    })
    .catch(error => {
      console.log('Add name failed');
      return res.status(500).json({
        message: 'Add name failed.',
        error: error,
      });
    });
};
