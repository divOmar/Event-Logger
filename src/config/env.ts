import "dotenv/config"




const port = Number(process.env.PORT)

if (!Number.isInteger(port) || port <= 0) {
throw new Error("PORT must be a valid positive number");
}
const node_env=process.env.NODE_ENV



export const config = {
    port,
    node_env
}
