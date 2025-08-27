import { env } from "../env";
import { app } from "./app";

app.listen(
  {
    host: "0.0.0.0",
    port: env.PORT,
  },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`🚀 HTTP Server Running! ${address}`);
  },
);
