import fastify from "fastify";
import { knex } from "./database";

const app = fastify();

app.get("/", async (req, res) => {
  const tables = await knex("sqlite_schema").select("*");

  return {
    tables
  };
});

const PORT = 3333;
app
  .listen({
    port: PORT,
  })
  .then(() => {
    console.log(`server running on http://127.0.0.1:${PORT}`);
  });
