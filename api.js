const express = require('express')
const app = express()
const port = 3001

const cors = require('cors');
const bodyParser = require('body-parser')

// use it before all route definitions
app.use(cors({origin: '*'}));
app.use(bodyParser.json())

const mongoose = require('mongoose')
mongoose.connect('mongodb://mongo/wedding');

require('./routes/registry')(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))