import app from "./app";
import {port} from "./config/config";

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});