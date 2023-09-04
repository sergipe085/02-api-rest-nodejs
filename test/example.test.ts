import { expect, test } from "vitest";

test("o usuario consegue criar um nova transacao", () => {
    const responseStatusCode = 201;

    expect(responseStatusCode).toEqual(201);
});