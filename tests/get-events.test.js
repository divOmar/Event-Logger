const {
  GetEvents,
} = require("../dist/Application/events/get-events");

describe("GetEvents", () => {
  let eventRepository;
  let getEvents;

  beforeEach(() => {
    eventRepository = {
      findAll: jest.fn(),
    };

    getEvents = new GetEvents(eventRepository);
  });

  test("should return events from the repository", async () => {
    const filters = {
      eventType: "USER_CREATED",
      source: "auth-service",
    };

    const pagination = {
      page: 1,
      limit: 10,
    };

    const result = {
      events: [
        {
          _id: "event-001",
          eventType: "USER_CREATED",
          source: "auth-service",
          payload: {
            userId: "user-001",
          },
          createdAt: new Date("2026-10-01T10:00:00.000Z"),
        },
      ],
      total: 1,
    };

    eventRepository.findAll.mockResolvedValue(result);

    const response = await getEvents.excute(filters, pagination);

    expect(eventRepository.findAll).toHaveBeenCalledTimes(1);
    expect(eventRepository.findAll).toHaveBeenCalledWith(
      filters,
      pagination
    );

    expect(response).toEqual(result);
  });

  test("should work without filters and pagination", async () => {
    const result = {
      events: [],
      total: 0,
    };

    eventRepository.findAll.mockResolvedValue(result);

    const response = await getEvents.excute();

    expect(eventRepository.findAll).toHaveBeenCalledTimes(1);
    expect(eventRepository.findAll).toHaveBeenCalledWith(
      undefined,
      undefined
    );

    expect(response).toEqual(result);
  });

  test("should propagate repository errors", async () => {
    const repositoryError = new Error("database query failed");

    eventRepository.findAll.mockRejectedValue(repositoryError);

    await expect(
      getEvents.excute(
        { eventType: "USER_CREATED" },
        { page: 1, limit: 10 }
      )
    ).rejects.toThrow("database query failed");

    expect(eventRepository.findAll).toHaveBeenCalledTimes(1);
  });
});