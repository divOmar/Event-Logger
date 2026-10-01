const mockSend = jest.fn();
const mockConnect = jest.fn();
const mockDisconnect = jest.fn();

jest.mock("kafkajs", () => ({
  Kafka: jest.fn(() => ({
    producer: jest.fn(() => ({
      connect: mockConnect,
      disconnect: mockDisconnect,
      send: mockSend,
    })),
  })),
}));

const {
  KafkaDeadLetterPublisher,
  connectDeadLetterKafka,
  disconnectDeadLetterKafka,
} = require("../dist/Infrastructure/Kafka/kafka-dead-letter.publisher");

describe("KafkaDeadLetterPublisher", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should connect the DLT producer", async () => {
    await connectDeadLetterKafka();

    expect(mockConnect).toHaveBeenCalledTimes(1);
  });

  test("should disconnect the DLT producer", async () => {
    await disconnectDeadLetterKafka();

    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  test("should publish the failed event to the configured DLT topic", async () => {
    const publisher = new KafkaDeadLetterPublisher();

    const event = {
      _id: "event-123",
      eventType: "ORDER_CREATED",
      source: "order-service",
      payload: {
        orderId: "order-123",
      },
      createdAt: new Date("2026-10-01T10:00:00.000Z"),
    };

    const error = new Error("processing failed");

    await publisher.publish(event, error, 3);

    expect(mockSend).toHaveBeenCalledTimes(1);

    const sentMessage = mockSend.mock.calls[0][0];

    expect(sentMessage.topic).toBe("events.dlt");

    expect(sentMessage.messages).toHaveLength(1);

    expect(sentMessage.messages[0].key).toBe("event-123");

    const parsedValue = JSON.parse(sentMessage.messages[0].value);

    expect(parsedValue.event).toEqual({
      ...event,
      createdAt: event.createdAt.toISOString(),
    });

    expect(parsedValue.error).toEqual({
      message: "processing failed",
    });

    expect(parsedValue.retryCount).toBe(3);

    expect(parsedValue.failedAt).toBeDefined();
  });

  test("should propagate Kafka publish errors", async () => {
    mockSend.mockRejectedValueOnce(new Error("Kafka publish failed"));

    const publisher = new KafkaDeadLetterPublisher();

    const event = {
      _id: "event-456",
      eventType: "USER_CREATED",
      source: "auth-service",
      payload: {
        userId: "user-456",
      },
      createdAt: new Date(),
    };

    await expect(
      publisher.publish(event, new Error("processing failed"), 3)
    ).rejects.toThrow("Kafka publish failed");
  });
});