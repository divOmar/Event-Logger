import "dotenv/config"




const port = Number(process.env.PORT)

if (!Number.isInteger(port) || port <= 0) {
throw new Error("PORT must be a valid positive number");
}
const node_env=process.env.NODE_ENV

const DB_URL=process.env.DB_URL

if (!DB_URL) {
  throw new Error("DB_URL is required");
}
export const config = {
    port,
    node_env,
    DB_URL
}
