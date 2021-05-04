
const express = require("express");
const bodyParser = require("body-parser");
const routes = require('./routes/routes');

const app = express();

app.use(bodyParser.json());
app.use(routes)

app.listen(2400, () => {
    console.log("Listening on port 2400");
});
