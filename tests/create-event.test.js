const {
  CreateEvent,
} = require("../dist/Application/events/create-event");

describe("CreateEvent", () => {
  let eventRepository;
  let eventPublisher;
  let createEvent;

  beforeEach(() => {
    eventRepository = {
      save: jest.fn(),
    };

    eventPublisher = {
      publish: jest.fn(),
    };

    createEvent = new CreateEvent(
      eventRepository,
      eventPublisher
    );
  });

  test("should save the event and publish the saved event", async () => {
    const input = {
      eventType: "USER_CREATED",
      source: "auth-service",
      payload: {
        userId: "user-001",
      },
    };

    const savedEvent = {
      _id: "event-001",
      eventType: "USER_CREATED",
      source: "auth-service",
      payload: {
        userId: "user-001",
      },
      createdAt: new Date("2026-10-01T10:00:00.000Z"),
    };

    eventRepository.save.mockResolvedValue(savedEvent);

    await createEvent.excute(input);

    expect(eventRepository.save).toHaveBeenCalledTimes(1);
    expect(eventRepository.save).toHaveBeenCalledWith(input);

    expect(eventPublisher.publish).toHaveBeenCalledTimes(1);
    expect(eventPublisher.publish).toHaveBeenCalledWith(savedEvent);
  });



  test("should not publish the event when saving fails", async () => {
  const input = {
    eventType: "USER_CREATED",
    source: "auth-service",
    payload: {
      userId: "user-002",
    },
  };

  const saveError = new Error("database save failed");

  eventRepository.save.mockRejectedValue(saveError);

  await expect(
    createEvent.excute(input)
  ).rejects.toThrow("database save failed");

  expect(eventRepository.save).toHaveBeenCalledWith(input);

  expect(eventPublisher.publish).not.toHaveBeenCalled();
});
test("should propagate the error when publishing fails", async () => {
  const input = {
    eventType: "ORDER_CREATED",
    source: "order-service",
    payload: {
      orderId: "order-001",
    },
  };

  const savedEvent = {
    _id: "event-002",
    eventType: "ORDER_CREATED",
    source: "order-service",
    payload: {
      orderId: "order-001",
    },
    createdAt: new Date("2026-10-01T11:00:00.000Z"),
  };

  const publishError = new Error("kafka publish failed");

  eventRepository.save.mockResolvedValue(savedEvent);
  eventPublisher.publish.mockRejectedValue(publishError);

  await expect(
    createEvent.excute(input)
  ).rejects.toThrow("kafka publish failed");

  expect(eventRepository.save).toHaveBeenCalledWith(input);

  expect(eventPublisher.publish).toHaveBeenCalledWith(savedEvent);
});
});