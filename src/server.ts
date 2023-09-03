import cookie from "@fastify/cookie";
import fastify from "fastify";
import { env } from "./env";
import { transactionsRoutes } from "./routes/transactions";

const app = fastify();

app.register(cookie);
app.register(transactionsRoutes, {
  prefix: "transactions"
})

const PORT = env.PORT;
app
  .listen({
    port: PORT,
  })
  .then(() => {
    console.log(`server running on http://127.0.0.1:${PORT}`);
  });
