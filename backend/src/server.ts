import app from "./app";
import {connectToRedisDB, testConnection} from "./config/db";
import {PORT} from "./config/config";

connectToRedisDB();

testConnection();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});