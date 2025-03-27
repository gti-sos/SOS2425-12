//const express = require("express");
import express from "express";
import { loadBackend } from "./src/back/index-GOS.js";
import { loadBackendFAG } from "./src/back/index-FAG.js";
import path from "path";

const BASE_API = "/api/v1";
const app = express();
const PORT = process.env.PORT || 16078;


app.use(express.json());
app.use("/",express.static("./public"));

loadBackend(app);
loadBackendFAG(app);

app.get("/about", (request, response) => {
    response.sendFile(path.resolve("./about/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
});