import { FastifyReply, FastifyRequest } from "fastify";

export function checkSessionIdExists(req: FastifyRequest, res: FastifyReply, done: any) {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
        return res.status(401).send({
            error: "Unauthorized."
        })
    }

    done();
}