require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const pino = require("pino");
const register = require("./routes/auth/register")
const login = require("./routes/auth/login");
const recipe = require("./routes/owner/recipe");
const foodieRecipe = require("./routes/foodie/recipe");

const app = express();
const logger = pino({ level: "info" });

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => logger.info("connected to mongodb..."))
  .catch((err) => logger.error(`failed to connect db... ${err}`));

app.use(express.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());
app.use("/api/register",register);
app.use("/api/login",login);
app.use("/api/owner/recipes",recipe);
app.use("/api/recipes",foodieRecipe);

const port = process.env.PORT || 5000;
app.listen(port, () => logger.info(`server started on port ${port}`));
