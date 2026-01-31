import express, { Application } from "express";
import { logger } from "./middlewares/logger";
import { errorHandler } from "./middlewares/errorHandler";

import driverRoutes from "./routes/driverRoutes";
import passengerRoutes from "./routes/passengerRoutes";
import rideRoutes from "./routes/rideRoutes";

const app: Application = express();

app.use(express.json()); // PRE ruta
app.use(logger);         

// Root ruta
app.get("/", (req: express.Request, res: express.Response) => {
    res.json({
        message: "Taxi app is running...",
        endpoints: {
            drivers: "/api/drivers",
            passengers: "/api/passengers",
            rides: "/api/rides"
        }
    });
});

// API rute
app.use('/api/drivers', driverRoutes);
app.use('/api/passengers', passengerRoutes);
app.use('/api/rides', rideRoutes);

app.use(errorHandler); // posle svih ruta!!!!!!!1


export default app;