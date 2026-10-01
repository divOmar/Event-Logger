const { execFileSync } = require("child_process");
const path = require("path");

const envFile = path.join(
  __dirname,
  "..",
  "dist",
  "config",
  "env.js"
);

const baseEnv = {
  PORT: "3000",
  NODE_ENV: "test",
  DB_URL: "mongodb://localhost:27017/event-log-service",
  KAFKA_BROKERS: "localhost:9092",
  KAFKA_TOPIC: "events",
  KAFKA_DLT_TOPIC: "events.dlt",
};

const loadConfig = (overrides = {}) => {
  const env = {
    ...process.env,
    ...baseEnv,
    ...overrides,
  };

  return execFileSync(
    process.execPath,
    ["-e", `require(${JSON.stringify(envFile)})`],
    {
      env,
      encoding: "utf8",
      stdio: "pipe",
    }
  );
};

const loadConfigAndExpectFailure = (overrides = {}) => {
  expect(() => loadConfig(overrides)).toThrow();
};

describe("configuration", () => {
  test("should load valid configuration", () => {
    expect(loadConfig()).toBeDefined();
  });

  test("should reject an invalid port", () => {
    loadConfigAndExpectFailure({
      PORT: "abc",
    });
  });

  test("should reject a missing database URL", () => {
    loadConfigAndExpectFailure({
      DB_URL: "",
    });
  });

  test("should reject a missing Kafka broker", () => {
    loadConfigAndExpectFailure({
      KAFKA_BROKERS: "",
    });
  });

  test("should reject a missing Kafka topic", () => {
    loadConfigAndExpectFailure({
      KAFKA_TOPIC: "",
    });
  });

  test("should reject a missing Kafka DLT topic", () => {
    loadConfigAndExpectFailure({
      KAFKA_DLT_TOPIC: "",
    });
  });
});