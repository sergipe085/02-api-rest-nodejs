import fastify from "fastify";
import { knex } from "./database";
import { env } from "./env";

const app = fastify();

app.get("/", async (req, res) => {
  const transactions = await knex("transactions").where("amount", 500).select("*");

  return {
    transactions
  };
});

const PORT = env.PORT;
app
  .listen({
    port: PORT,
  })
  .then(() => {
    console.log(`server running on http://127.0.0.1:${PORT}`);
  });
