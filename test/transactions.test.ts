import { execSync } from "child_process";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, test } from "vitest";
import { app } from "../src/app";

describe("transaction routes", async () => {
    beforeAll(async () => {
        await app.ready();
    });
    
    afterAll(async () => {
        await app.close();
    })

    beforeEach(() => {
        execSync("npm run knex migrate:rollback --all")
        execSync("npm run knex migrate:latest")
    })
    
    test("user can create a new transaction", async () => {
        const response = await request(app.server).post("/transactions").send({
            title: "New transaction",
            amount: 500,
            type: "credit"
        })
    
        const responseStatusCode = response.statusCode;
    
        expect(responseStatusCode).toEqual(201);
    });

    test("user can list transactions", async () => {
        const createTransactionResponse = await request(app.server).post("/transactions").send({
            title: "New transaction",
            amount: 500,
            type: "credit"
        });

        const { session_id } = createTransactionResponse.body.transaction[0];

        const listTransactionsResponse = await request(app.server).get("/transactions").set("Cookie", [`sessionId=${session_id}`])

        const { transactions } = listTransactionsResponse.body;

        expect(listTransactionsResponse.statusCode).toEqual(200);
        expect(transactions).toEqual([
            expect.objectContaining({
                title: "New transaction",
                amount: 500,
            })
        ]);
    })

    test("user can get transaction", async () => {
        const createTransactionResponse = await request(app.server).post("/transactions").send({
            title: "New transaction",
            amount: 500,
            type: "credit"
        });

        const { session_id, id } = createTransactionResponse.body.transaction[0];

        const getTransactionResponse = await request(app.server).get(`/transactions/${id}`).set("Cookie", [`sessionId=${session_id}`])

        const { transaction } = getTransactionResponse.body;

        expect(getTransactionResponse.statusCode).toEqual(200);
        expect(transaction).toEqual(expect.objectContaining({
            title: "New transaction",
            amount: 500,
        }));
    })

    test("user can get your summary", async () => {
        const createTransactionResponse = await request(app.server).post("/transactions").send({
            title: "New transaction",
            amount: 500,
            type: "credit"
        });

        const { session_id } = createTransactionResponse.body.transaction[0];

        await request(app.server).post("/transactions").set("Cookie", [`sessionId=${session_id}`]).send({
            title: "New transaction",
            amount: 199,
            type: "debit"
        });

        const getSummaryResponse = await request(app.server).get(`/transactions/summary`).set("Cookie", [`sessionId=${session_id}`])

        const { summary } = getSummaryResponse.body;

        console.log(getSummaryResponse.body)

        expect(getSummaryResponse.statusCode).toEqual(200);
        expect(summary).toEqual(expect.objectContaining({
            amount: 301
        }));
    })
})
