const express = require('express')
const app = express()
const port = 3001
const cors = require('cors');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const waitPort = require('wait-port')

const params = {
  host: 'mongo',
  port: 27017,
};

// use it before all route definitions
app.use(cors({origin: '*'}));
app.use(bodyParser.json())

waitPort(params)
  .then((open) => {
    if (open){
        mongoose.connect('mongodb://mongo/wedding');
        require('./routes/registry')(app);
        app.listen(port, () => console.log(`Example app listening on port ${port}!`))
    }
    else console.log('The port did not open before the timeout...');
  })
  .catch((err) => {
    console.log(`An unknown error occured while waiting for the port: ${err}`);
  });

