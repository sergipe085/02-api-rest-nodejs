import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";

export async function transactionsRoutes(app: FastifyInstance) {
    app.get("/", async(req, res) => {
        const transactions = await knex("transactions").select("*");

        return {
            transactions
        }
    })

    app.get("/:id", async(req, res) => {
        const getTransacionByIdParamsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = getTransacionByIdParamsSchema.parse(req.params);

        const transaction = await knex("transactions").where({
            id
        }).first();

        return {
            transaction
        }
    })

    app.get("/summary", async (req, res) => {
        const summary = await knex('transactions').sum("amount", {
            as: "amount"
        }).first();

        return {
            summary
        }
    })

    app.post("/", async (req, res) => {
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(["credit", "debit"])
        })

        const { title, amount, type } = createTransactionBodySchema.parse(req.body);

        let sessionId = req.cookies.sessionId;

        if (!sessionId) {
            sessionId = randomUUID();

            res.cookie("sessionId", sessionId, {
                path: "/",
                maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
            });
        }

        const transaction = await knex("transactions").insert({
            id: randomUUID(),
            title,
            amount: type == "credit" ? amount : -amount,
            session_id: sessionId
        }).returning("*")

        return res.status(201).send({
            transaction
        });
    });
}