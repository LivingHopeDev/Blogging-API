import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { dbConnection } from "./src/config/Db.js";
import { logger } from "./src/logger/logger.js";
import cors from "cors";
import { httpLogger } from "./src/logger/httpLogger.js";
import { all_Routes_function } from "./src/index.js";
import { notFound } from "./src/middlewares/errors/notFound.js";
// import { errorHandlerMiddleware } from "./src/middlewares/errors/errorHandler.js";
import { job } from "./src/helper/cronJob.js";
const port = process.env.PORT || 3001;
const app = express();
// job.start();
// let corsOptions = {
//   origin: ["http://localhost:3000"],
// };
app.use(httpLogger);
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
dbConnection(process.env.MONGO_URI);

all_Routes_function(app);

// app.use(errorHandlerMiddleware);
app.use(notFound);

export const server = app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});