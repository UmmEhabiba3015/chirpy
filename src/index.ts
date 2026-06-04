import express from "express";
import { handlerReadiness } from "./routeHandlers/readiness.js";
import { middlewareLogResponses } from "./middleware/logResposes.middleware.js";
import { middlewareMetricsInc } from "./middleware/metricsInc.middleware.js";
import { getFileServerHits } from "./routeHandlers/getFileServerHits.js";
import { resetFileServerHits } from "./routeHandlers/resetFileServerHits.js";
import { validateChirp } from "./routeHandlers/validateChirp.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import { createUserHandler } from "./routeHandlers/users/createUser.js";
import { resetUsersHandler } from "./routeHandlers/users/resetUsers.js";
import { chirpsHandler } from "./routeHandlers/chirps/createChirps.js";
import { getChirpByIdHandler, getChirpsHandler } from "./routeHandlers/chirps/getChirps.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", getFileServerHits);

// app.post("/admin/reset", resetFileServerHits);
// app.post("/api/validate_chirp", validateChirp);

app.post("/api/users", createUserHandler);
app.post("/admin/reset", resetUsersHandler); 
app.post("/api/chirps", chirpsHandler);
app.get("/api/chirps", getChirpsHandler);
app.get("/api/chirps/:chirpId", getChirpByIdHandler);

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`Health check endpoint: http://localhost:${PORT}/api/healthz`);
});
