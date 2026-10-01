const mockRun = jest.fn();
const mockConnect = jest.fn();
const mockDisconnect = jest.fn();
const mockSubscribe = jest.fn();

jest.mock("kafkajs", () => ({
  Kafka: jest.fn(() => ({
    consumer: jest.fn(() => ({
      connect: mockConnect,
      disconnect: mockDisconnect,
      subscribe: mockSubscribe,
      run: mockRun,
    })),
  })),
}));

const {
  startKafkaConsumer,
  connectKafkaConsumer,
  subscribeToEvents,
  disconnectKafkaConsumer,
} = require("../dist/Infrastructure/Kafka/kafka-event.consumer");



describe("Kafka Consumer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should process a valid Kafka event", async () => {
    const eventConsumer = {
      consume: jest.fn().mockResolvedValue(undefined),
    };

    const deadLetterPublisher = {
      publish: jest.fn(),
    };

    mockRun.mockImplementation(async ({ eachMessage }) => {
      await eachMessage({
        message: {
          value: Buffer.from(
            JSON.stringify({
              _id: "kafka-test-001",
              eventType: "USER_CREATED",
              source: "test-service",
              payload: {
                userId: "user-001",
              },
              createdAt: new Date().toISOString(),
            })
          ),
        },
      });
    });

    await startKafkaConsumer(eventConsumer, deadLetterPublisher);

    expect(eventConsumer.consume).toHaveBeenCalledTimes(1);

    expect(eventConsumer.consume).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: "kafka-test-001",
        eventType: "USER_CREATED",
        source: "test-service",
      })
    );

    expect(deadLetterPublisher.publish).not.toHaveBeenCalled();
  });

  test("should ignore invalid JSON messages", async () => {
    const eventConsumer = {
      consume: jest.fn(),
    };

    const deadLetterPublisher = {
      publish: jest.fn(),
    };

    mockRun.mockImplementation(async ({ eachMessage }) => {
      await eachMessage({
        message: {
          value: Buffer.from("this is not valid JSON"),
        },
      });
    });

    await startKafkaConsumer(eventConsumer, deadLetterPublisher);

    expect(eventConsumer.consume).not.toHaveBeenCalled();
    expect(deadLetterPublisher.publish).not.toHaveBeenCalled();
  });

  test("should ignore invalid Kafka event data", async () => {
    const eventConsumer = {
      consume: jest.fn(),
    };

    const deadLetterPublisher = {
      publish: jest.fn(),
    };

    mockRun.mockImplementation(async ({ eachMessage }) => {
      await eachMessage({
        message: {
          value: Buffer.from(
            JSON.stringify({
              _id: "kafka-test-002",
              source: "test-service",
              payload: {
                userId: "user-002",
              },
              createdAt: new Date().toISOString(),
            })
          ),
        },
      });
    });

    await startKafkaConsumer(eventConsumer, deadLetterPublisher);

    expect(eventConsumer.consume).not.toHaveBeenCalled();
    expect(deadLetterPublisher.publish).not.toHaveBeenCalled();
  });

  test("should retry when event processing fails", async () => {
    const eventConsumer = {
      consume: jest
        .fn()
        .mockRejectedValue(new Error("processing failed")),
    };

    const deadLetterPublisher = {
      publish: jest.fn(),
    };

    mockRun.mockImplementation(async ({ eachMessage }) => {
      await eachMessage({
        message: {
          value: Buffer.from(
            JSON.stringify({
              _id: "kafka-test-003",
              eventType: "USER_CREATED",
              source: "test-service",
              payload: {
                userId: "user-003",
              },
              createdAt: new Date().toISOString(),
            })
          ),
        },
      });
    });

    await startKafkaConsumer(eventConsumer, deadLetterPublisher);

    expect(eventConsumer.consume).toHaveBeenCalledTimes(4);
  });

  test("should publish to dead letter publisher after all retries fail", async () => {
    const processingError = new Error("processing failed");

    const eventConsumer = {
      consume: jest.fn().mockRejectedValue(processingError),
    };

    const deadLetterPublisher = {
      publish: jest.fn(),
    };

    mockRun.mockImplementation(async ({ eachMessage }) => {
      await eachMessage({
        message: {
          value: Buffer.from(
            JSON.stringify({
              _id: "kafka-test-004",
              eventType: "ORDER_CREATED",
              source: "order-service",
              payload: {
                orderId: "order-001",
              },
              createdAt: new Date().toISOString(),
            })
          ),
        },
      });
    });

    await startKafkaConsumer(eventConsumer, deadLetterPublisher);

    expect(eventConsumer.consume).toHaveBeenCalledTimes(4);

    expect(deadLetterPublisher.publish).toHaveBeenCalledTimes(1);

    expect(deadLetterPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: "kafka-test-004",
        eventType: "ORDER_CREATED",
        source: "order-service",
      }),
      processingError,
      3
    );
  });

  test("should ignore Kafka messages with no value", async () => {
    const eventConsumer = {
      consume: jest.fn(),
    };

    const deadLetterPublisher = {
      publish: jest.fn(),
    };

    mockRun.mockImplementation(async ({ eachMessage }) => {
      await eachMessage({
        message: {
          value: null,
        },
      });
    });

    await startKafkaConsumer(eventConsumer, deadLetterPublisher);

    expect(eventConsumer.consume).not.toHaveBeenCalled();
    expect(deadLetterPublisher.publish).not.toHaveBeenCalled();
  });

  test("should connect Kafka consumer successfully", async () => {
    await connectKafkaConsumer();

    expect(mockConnect).toHaveBeenCalledTimes(1);
  });
});



test("should subscribe to Kafka topic successfully", async () => {
  await subscribeToEvents();

  expect(mockSubscribe).toHaveBeenCalledTimes(1);

  expect(mockSubscribe).toHaveBeenCalledWith({
    topic: expect.any(String),
    fromBeginning: true,
  });
});


test("should disconnect Kafka consumer successfully", async () => {
  await disconnectKafkaConsumer();

  expect(mockDisconnect).toHaveBeenCalledTimes(1);
});