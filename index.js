const express = require("express"); 
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
const cors = require('cors');
const pino = require('pino');

const app = express();
const logger = pino({level: 'info'});

mongoose.connect("mongodb://0.0.0.0:27017/hungryManDB").
then(()=> logger.info("connected to mongodb...")).
catch((err) => logger.error("failed to connect db...",err));

app.use(express.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

app.use(cors());

const port = process.env.PORT || 5000;
app.listen(port, () => logger.info(`server started on port ${port}`));

// Health check route
app.get("/",(req,res)=> {
    res.send("app started!!")
})