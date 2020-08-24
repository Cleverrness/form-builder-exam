//#region express configures
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("./mongoose");

// Configurations
const app = express();

const corsConfig = {
    origin: true,
    credentials: true
};
app.use(cors(corsConfig));
app.options("*",cors(corsConfig));

app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json

app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, "public"))); //To serve static files such as images, CSS files, and JavaScript files

const port = "3000";
const forms = require("./routes/forms");

// #end Configurations

app.get("/", (req, res) => {
    mongoose.get_all_forms().then((allForms) => {
        console.log(allForms);
        res.send(allForms);
    });
});

app.use("/forms", forms);


app.use(function (err, req, res, next) {
    console.error(err);
    res.status(err.status || 500).send({ message: err.message });
});

const server = app.listen(port, () => {
    console.log(`Server listen on port ${port}`);
});
