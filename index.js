const cool = require("cool-ascii-faces")
const express = require("express");
const app = express();
const PORT = process.env.PORT || 16078;

app.use("/", express.static(__dirname));

app.get("/cool", (request, response) => {
    response.send(cool());
});

app.get("/", (request, response) => {
    response.redirect("/about");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
});