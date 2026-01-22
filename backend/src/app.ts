import express, { Application } from "express";
import {logger} from "./middlewares/logger";
import {errorHandler} from "./middlewares/errorHandler";

const app: Application = express();

app.use(express.json());
app.use(logger);
app.use(errorHandler);


app.get("/", (req: express.Request, res: express.Response) => {
    res.send("Taxi app is running...").end();
});

export default app;
