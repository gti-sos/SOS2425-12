import express from "express";
import cors from "cors";
import { loadBackendGOS } from "./src/back/index-GOS.js";
import { loadBackendFAG } from "./src/back/index-FAG.js";
import { loadBackendFAGv2 } from "./src/back/index-FAG-v2.js";
import { loadBackendCRR } from "./src/back/index-CRR.js";
import { handler } from "./src/front/build/handler.js";

const app = express();
const PORT = process.env.PORT || 16078;


app.use(express.json());
app.use(cors());

loadBackendGOS(app);

loadBackendFAG(app);
loadBackendFAGv2(app);

loadBackendCRR(app);



app.use(handler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
});
