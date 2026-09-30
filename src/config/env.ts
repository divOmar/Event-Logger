import "dotenv/config"




const port = Number(process.env.PORT)

if (!Number.isInteger(port) || port <= 0) {
throw new Error("PORT must be a valid positive number");
}
const node_env=process.env.NODE_ENV
if (
  node_env !== "development" &&
  node_env !== "production" &&
  node_env !== "test"
) {
  throw new Error(
    "NODE_ENV must be development, production, or test"
  );
}
const DB_URL=process.env.DB_URL

if (!DB_URL) {
  throw new Error("DB_URL is required");
}

const KafkaBrokers= process.env.KAFKA_BROKERS
if(!KafkaBrokers){
  throw new Error("Kafka Broker is required")
}
const KafkaTopic= process.env.KAFKA_TOPIC
if(!KafkaTopic){
  throw new Error("Kafka topic is required")
}


const kafkaBrokers = KafkaBrokers
  .split(",")
  .map((broker) => broker.trim())
  .filter(Boolean);

if (kafkaBrokers.length === 0) {
  throw new Error("At least one Kafka broker is required");
}

export const config = {
    port,
    node_env,
    DB_URL,
    KafkaBrokers:kafkaBrokers,
    KafkaTopic
}
