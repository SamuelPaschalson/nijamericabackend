require("./config/db");
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("express").json;
const routes = require("./routes");
const connectDB = require("./config/db");
connectDB();

app.use(cors());
app.use(bodyParser());
app.use(routes);
app.use(morgan("dev"));
app.use(express.static('uploads'));
module.exports = app;
