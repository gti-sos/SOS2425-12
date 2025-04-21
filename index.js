import express from "express";
import cors from "cors";
import { loadBackendGOS } from "./src/back/index-GOS.js";
import { loadBackendFAG } from "./src/back/index-FAG.js";
import { loadBackendCRR } from "./src/back/index-CRR.js";
import { handler } from "./src/front/build/handler.js";

const app = express();
const PORT = process.env.PORT || 16078;


app.use(express.json());
app.use(cors());
// app.use("/",express.static("./public"));

loadBackendGOS(app);

loadBackendFAG(app);

loadBackendCRR(app);

// app.get("/about", (request, response) => {
//     response.sendFile(path.resolve("./about/index.html"));
// });

app.use(handler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
});
