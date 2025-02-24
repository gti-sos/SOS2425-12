const cool = require("cool-ascii-faces")

app.get("/cool", (request, response) => {
    response.send(cool());
});