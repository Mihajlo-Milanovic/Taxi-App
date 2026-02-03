import express, { Application } from "express";
import { logger } from "./middlewares/logger";
import { errorHandler } from "./middlewares/errorHandler";
import * as swaggerUI from "swagger-ui-express";
import driverRoutes from "./routes/driverRoutes";
import passengerRoutes from "./routes/passengerRoutes";
import vehicleRoutes from "./routes/vehicleRoutes";
import rideRoutes from "./routes/rideRoutes";
import {swaggerDocs} from "./swagger/swaggerConfig";

const app: Application = express();

app.use(express.json());
app.use(logger);

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use('/drivers', driverRoutes);
app.use('/passengers', passengerRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/rides', rideRoutes);

app.get("/", (req: express.Request, res: express.Response) => {
    res.json({
        message: "Taxi app is running...",
        endpoints: [
            "drivers",
            "passengers",
            "vehicles",
            "rides"
        ]
    });
});

app.use(errorHandler);

export default app;
