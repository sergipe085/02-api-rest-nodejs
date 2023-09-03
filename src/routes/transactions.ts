import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";

export async function transactionsRoutes(app: FastifyInstance) {
    app.post("/", async (req, res) => {
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(["credit", "debit"])
        })

        const { title, amount, type } = createTransactionBodySchema.parse(req.body);

        const transaction = await knex("transactions").insert({
            id: randomUUID(),
            title,
            amount: type == "credit" ? amount : -amount
        }).returning("*")

        return res.status(201).send({
            transaction
        });
    });
}