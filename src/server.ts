import fastify from "fastify";

const app = fastify();

app.get("/", (req, res) => {
  return {
    message: "WORKING!",
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
