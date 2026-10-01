const mockExists = jest.fn();
const mockFindOneAndUpdate = jest.fn();

jest.mock(
  "../dist/Infrastructure/mongodb/Models/processed-event.model",
  () => ({
    ProcessedEventModel: {
      exists: mockExists,
      findOneAndUpdate: mockFindOneAndUpdate,
    },
  })
);

const {
  MongoProccessedEventRepositry,
} = require("../dist/Infrastructure/events/mongo-processed-event.repository");

describe("MongoProccessedEventRepositry", () => {
  let repository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new MongoProccessedEventRepositry();
  });

  test("should return true when event is already processed", async () => {
    mockExists.mockResolvedValue({
      _id: "processed-event-001",
    });

    const result = await repository.exists("event-001");

    expect(mockExists).toHaveBeenCalledWith({
      eventId: "event-001",
      status: "PROCESSED",
    });

    expect(result).toBe(true);
  });

  test("should return false when event is not processed", async () => {
    mockExists.mockResolvedValue(null);

    const result = await repository.exists("event-002");

    expect(mockExists).toHaveBeenCalledWith({
      eventId: "event-002",
      status: "PROCESSED",
    });

    expect(result).toBe(false);
  });

  test("should mark event as processing", async () => {
    mockFindOneAndUpdate.mockResolvedValue({});

    await repository.markAsProcessing("event-003");

    expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
      {
        eventId: "event-003",
      },
      {
        eventId: "event-003",
        status: "PROCESSING",
        error: null,
        processedAt: null,
      },
      {
        upsert: true,
        new: true,
      }
    );
  });

  test("should mark event as processed", async () => {
    mockFindOneAndUpdate.mockResolvedValue({});

    await repository.marksAsProcessed("event-004");

    expect(mockFindOneAndUpdate).toHaveBeenCalledTimes(1);

    const [filter, update] = mockFindOneAndUpdate.mock.calls[0];

    expect(filter).toEqual({
      eventId: "event-004",
    });

    expect(update.status).toBe("PROCESSED");
    expect(update.processedAt).toBeInstanceOf(Date);
  });

  test("should mark event as failed", async () => {
    mockFindOneAndUpdate.mockResolvedValue({});

    await repository.markAsFailed(
      "event-005",
      "database connection failed"
    );

    expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
      {
        eventId: "event-005",
      },
      {
        status: "FAILED",
        error: "database connection failed",
      }
    );
  });
});