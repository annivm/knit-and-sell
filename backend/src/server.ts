import app from "./app";
import { config } from "./config/env";



app.listen(config.PORT, (): void => {
    console.log(`Server runnin on port: ${config.PORT}`);
});

