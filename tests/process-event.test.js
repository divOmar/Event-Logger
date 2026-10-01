const {
  ProccessEvent,
} = require("../dist/Application/events/process-event");

describe("ProccessEvent", () => {
  let processedEventRepository;
  let processEvent;

  const event = {
    _id: "event-001",
    eventType: "USER_CREATED",
    source: "auth-service",
    payload: {
      userId: "user-001",
    },
    createdAt: new Date("2026-10-01T10:00:00.000Z"),
  };

  beforeEach(() => {
    processedEventRepository = {
      exists: jest.fn(),
      markAsProcessing: jest.fn(),
      marksAsProcessed: jest.fn(),
      markAsFailed: jest.fn(),
    };

    processEvent = new ProccessEvent(processedEventRepository);
  });

  test("should skip the event when it was already processed", async () => {
    processedEventRepository.exists.mockResolvedValue(true);

    await processEvent.consume(event);

    expect(processedEventRepository.exists).toHaveBeenCalledWith(
      event._id
    );

    expect(
      processedEventRepository.markAsProcessing
    ).not.toHaveBeenCalled();

    expect(
      processedEventRepository.marksAsProcessed
    ).not.toHaveBeenCalled();

    expect(
      processedEventRepository.markAsFailed
    ).not.toHaveBeenCalled();
  });

  test("should mark a new event as processing and then processed", async () => {
    processedEventRepository.exists.mockResolvedValue(false);

    await processEvent.consume(event);

    expect(
      processedEventRepository.exists
    ).toHaveBeenCalledWith(event._id);

    expect(
      processedEventRepository.markAsProcessing
    ).toHaveBeenCalledWith(event._id);

    expect(
      processedEventRepository.marksAsProcessed
    ).toHaveBeenCalledWith(event._id);

    expect(
      processedEventRepository.markAsFailed
    ).not.toHaveBeenCalled();
  });

  test("should mark the event as failed and rethrow the error", async () => {
    const processingError = new Error("processing failed");

    processedEventRepository.exists.mockResolvedValue(false);

    processedEventRepository.marksAsProcessed.mockRejectedValue(
      processingError
    );

    await expect(
      processEvent.consume(event)
    ).rejects.toThrow("processing failed");

    expect(
      processedEventRepository.markAsProcessing
    ).toHaveBeenCalledWith(event._id);

    expect(
      processedEventRepository.markAsFailed
    ).toHaveBeenCalledWith(
      event._id,
      "processing failed"
    );
  });
});