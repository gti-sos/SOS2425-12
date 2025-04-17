import express from "express";
import { loadBackendGOS } from "./src/back/index-GOS.js";
import { loadBackendFAG } from "./src/back/index-FAG.js";
import { loadBackendCRR } from "./src/back/index-CRR.js";

import cors from "cors";
import { handler } from "./src/front/build/handler.js";
import path from "path";

const app = express();
const PORT = process.env.PORT || 16078;


app.use(express.json());
app.use("/",express.static("./public"));
app.use(cors());
// app.use(handler);


loadBackendGOS(app);

loadBackendFAG(app);

loadBackendCRR(app);

app.get("/about", (request, response) => {
    response.sendFile(path.resolve("./about/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
});