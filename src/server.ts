import { app } from "./app";
import { env } from "./env";

const PORT = env.PORT;
app
  .listen({
    port: PORT,
  })
  .then(() => {
    console.log(`server running on http://127.0.0.1:${PORT}`);
  });
