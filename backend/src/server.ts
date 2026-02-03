import app from "./app";
import {connectToRedisDB, testConnection} from "./config/db";
import {PORT, SWAGGER_PORT} from "./config/config";

connectToRedisDB().then(()=> {
    testConnection().then(()=> {

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`Swagger docs available at http://localhost:${PORT}/docs`);
        });
    });
});

