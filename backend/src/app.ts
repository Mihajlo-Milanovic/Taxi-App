import express, { Application } from "express";
import { logger } from "./middlewares/logger";
import { errorHandler } from "./middlewares/errorHandler";

import driverRoutes from "./routes/driverRoutes";
import passengerRoutes from "./routes/passengerRoutes";
import rideRoutes from "./routes/rideRoutes";

const app: Application = express();

app.use(express.json());
app.use(logger);
app.use(errorHandler);

app.use('/drivers', driverRoutes);
app.use('/passengers', passengerRoutes);
app.use('/rides', rideRoutes);

// Root ruta
app.get("/", (req: express.Request, res: express.Response) => {
    res.json({
        message: "Taxi app is running...",
        endpoints: [
            "drivers",
            "passengers",
            "rides"
        ]
    });
});

export default app;
