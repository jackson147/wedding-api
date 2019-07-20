const express = require('express')
const app = express()
const port = 3001

const https = require('https')
const fs = require('fs')

const cors = require('cors');
const bodyParser = require('body-parser')

// use it before all route definitions
app.use(cors({origin: '*'}));
app.use(bodyParser.json())

const mongoose = require('mongoose')
mongoose.connect('mongodb://mongo/wedding');

require('./routes/registry')(app);

https.createServer({
	ca: fs.readFileSync('/run/secrets/server.ca'),
	key: fs.readFileSync('/run/secrets/server.key'),
	cert: fs.readFileSync('/run/secrets/server.crt')
}, app)
.listen(port, function () {
	console.log(`Example app listening on port ${port}!`)
})