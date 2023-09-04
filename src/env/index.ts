import { config } from "dotenv";
import { z } from "zod";

if (process.env.NODE_ENV == "test") {
    config({
        path: ".env.test"
    })
}
else {
    config()
}

const envSchema = z.object({
    NODE_ENV: z.enum(["DEVELOPMENT", "test", "PRODUCTION"]).default("PRODUCTION"),
    DATABASE_URL: z.string(),
    PORT: z.number().default(3333)
})

const _env = envSchema.safeParse(process.env);

if (_env.success == false) {
    const errorMessage = "⚠️ Invalid environment variables! " + _env.error.format()
    console.error("⚠️ Invalid environment variables! ", _env.error.format());
    throw new Error(errorMessage);
}

export const env = _env.data;