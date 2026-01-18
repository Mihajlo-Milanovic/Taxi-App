import express, { Application } from "express";

const app: Application = express();

app.use(express.json());

app.get("/", (_req, res) => {
    res.send("Hello Express + TypeScript");
});

export default app;
