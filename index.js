const cool = require("cool-ascii-faces")
const express = require("express");
const cool = require("cool-ascii-faces");
const app = express();
const PORT = process.env.PORT || 16078;

app.get("/cool", (request, response) => {
    response.send(cool());
});

app.use("/", express.static("./public"));