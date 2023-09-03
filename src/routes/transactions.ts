import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export async function transactionsRoutes(app: FastifyInstance) {
    app.get("/", {
        preHandler: [checkSessionIdExists]
    }, async(req, res) => {
        const { sessionId } = req.cookies;

        const transactions = await knex("transactions").where("session_id", sessionId).select("*");

        return {
            transactions
        }
    })

    app.get("/:id", {
        preHandler: [checkSessionIdExists]
    }, async(req, res) => {
        const { sessionId } = req.cookies;

        const getTransacionByIdParamsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = getTransacionByIdParamsSchema.parse(req.params);

        const transaction = await knex("transactions").where({
            id,
        }).first();

        if (!transaction) {
            return res.status(400).send({
                error: "Transacion doesnt exists"
            })
        }

        if (transaction.session_id != sessionId) {
            return res.status(401).send({
                error: "Unauthorized."
            })
        }

        return {
            transaction
        }
    })

    app.get("/summary", {
        preHandler: [checkSessionIdExists]
    }, async (req, res) => {
        const { sessionId } = req.cookies;

        const summary = await knex('transactions').where({
            session_id: sessionId
        }).sum("amount", {
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