const mockCreate = jest.fn();
const mockFind = jest.fn();
const mockCountDocuments = jest.fn();

jest.mock("../dist/Infrastructure/mongodb/Models/event.model", () => ({
  EventModel: {
    create: mockCreate,
    find: mockFind,
    countDocuments: mockCountDocuments,
  },
}));

const {
  EventMongoRepositery,
} = require("../dist/Infrastructure/events/mongo-event.repository");

describe("EventMongoRepositery", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should save an event successfully", async () => {
    const repository = new EventMongoRepositery();

    const input = {
      eventType: "USER_CREATED",
      source: "auth-service",
      payload: {
        userId: "user-001",
        email: "test@example.com",
      },
    };

    mockCreate.mockResolvedValue({
      _id: {
        toString: () => "mongo-event-001",
      },
      eventType: "USER_CREATED",
      source: "auth-service",
      payload: {
        userId: "user-001",
        email: "test@example.com",
      },
      createdAt: new Date("2026-10-01T10:00:00.000Z"),
    });

    const result = await repository.save(input);

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith(input);

    expect(result).toEqual({
      _id: "mongo-event-001",
      eventType: "USER_CREATED",
      source: "auth-service",
      payload: {
        userId: "user-001",
        email: "test@example.com",
      },
      createdAt: new Date("2026-10-01T10:00:00.000Z"),
    });
  });

  test("should return all events", async () => {
    const repository = new EventMongoRepositery();

    const events = [
      {
        _id: {
          toString: () => "mongo-event-001",
        },
        eventType: "USER_CREATED",
        source: "auth-service",
        payload: {
          userId: "user-001",
        },
        createdAt: new Date("2026-10-01T10:00:00.000Z"),
      },
      {
        _id: {
          toString: () => "mongo-event-002",
        },
        eventType: "USER_LOGIN",
        source: "auth-service",
        payload: {
          userId: "user-002",
        },
        createdAt: new Date("2026-10-01T09:00:00.000Z"),
      },
    ];

    const lean = jest.fn().mockResolvedValue(events);

    const limit = jest.fn().mockReturnValue({
      lean,
    });

    const skip = jest.fn().mockReturnValue({
      limit,
    });

    const sort = jest.fn().mockReturnValue({
      skip,
    });

    mockFind.mockReturnValue({
      sort,
    });

    mockCountDocuments.mockResolvedValue(2);

    const result = await repository.findAll();

    expect(mockFind).toHaveBeenCalledWith({});

    expect(sort).toHaveBeenCalledWith({
      createdAt: -1,
    });

    expect(skip).toHaveBeenCalledWith(0);

    expect(limit).toHaveBeenCalledWith(0);

    expect(lean).toHaveBeenCalledTimes(1);

    expect(mockCountDocuments).toHaveBeenCalledWith({});

    expect(result).toEqual({
      events: [
        {
          _id: "mongo-event-001",
          eventType: "USER_CREATED",
          source: "auth-service",
          payload: {
            userId: "user-001",
          },
          createdAt: new Date("2026-10-01T10:00:00.000Z"),
        },
        {
          _id: "mongo-event-002",
          eventType: "USER_LOGIN",
          source: "auth-service",
          payload: {
            userId: "user-002",
          },
          createdAt: new Date("2026-10-01T09:00:00.000Z"),
        },
      ],
      total: 2,
    });
  });
});




test("should filter events by eventType", async () => {
  const repository = new EventMongoRepositery();

  const events = [
    {
      _id: {
        toString: () => "mongo-event-003",
      },
      eventType: "USER_CREATED",
      source: "auth-service",
      payload: {
        userId: "user-003",
      },
      createdAt: new Date("2026-10-01T11:00:00.000Z"),
    },
  ];

  const lean = jest.fn().mockResolvedValue(events);

  const limit = jest.fn().mockReturnValue({
    lean,
  });

  const skip = jest.fn().mockReturnValue({
    limit,
  });

  const sort = jest.fn().mockReturnValue({
    skip,
  });

  mockFind.mockReturnValue({
    sort,
  });

  mockCountDocuments.mockResolvedValue(1);

  const result = await repository.findAll({
    eventType: "USER_CREATED",
  });

  expect(mockFind).toHaveBeenCalledWith({
    eventType: "USER_CREATED",
  });

  expect(mockCountDocuments).toHaveBeenCalledWith({
    eventType: "USER_CREATED",
  });

  expect(result.events).toHaveLength(1);

  expect(result.events[0]).toEqual({
    _id: "mongo-event-003",
    eventType: "USER_CREATED",
    source: "auth-service",
    payload: {
      userId: "user-003",
    },
    createdAt: new Date("2026-10-01T11:00:00.000Z"),
  });

  expect(result.total).toBe(1);
});









test("should filter events by source", async () => {
  const repository = new EventMongoRepositery();

  const events = [
    {
      _id: {
        toString: () => "mongo-event-004",
      },
      eventType: "ORDER_CREATED",
      source: "order-service",
      payload: {
        orderId: "order-001",
      },
      createdAt: new Date("2026-10-01T12:00:00.000Z"),
    },
  ];

  const lean = jest.fn().mockResolvedValue(events);

  const limit = jest.fn().mockReturnValue({
    lean,
  });

  const skip = jest.fn().mockReturnValue({
    limit,
  });

  const sort = jest.fn().mockReturnValue({
    skip,
  });

  mockFind.mockReturnValue({
    sort,
  });

  mockCountDocuments.mockResolvedValue(1);

  const result = await repository.findAll({
    source: "order-service",
  });

  expect(mockFind).toHaveBeenCalledWith({
    source: "order-service",
  });

  expect(mockCountDocuments).toHaveBeenCalledWith({
    source: "order-service",
  });

  expect(result.events).toHaveLength(1);

  expect(result.events[0]).toEqual({
    _id: "mongo-event-004",
    eventType: "ORDER_CREATED",
    source: "order-service",
    payload: {
      orderId: "order-001",
    },
    createdAt: new Date("2026-10-01T12:00:00.000Z"),
  });

  expect(result.total).toBe(1);
});
test("should filter events by eventType and source", async () => {
  const repository = new EventMongoRepositery();

  const events = [
    {
      _id: {
        toString: () => "mongo-event-005",
      },
      eventType: "USER_CREATED",
      source: "auth-service",
      payload: {
        userId: "user-005",
      },
      createdAt: new Date("2026-10-01T13:00:00.000Z"),
    },
  ];

  const lean = jest.fn().mockResolvedValue(events);

  const limit = jest.fn().mockReturnValue({
    lean,
  });

  const skip = jest.fn().mockReturnValue({
    limit,
  });

  const sort = jest.fn().mockReturnValue({
    skip,
  });

  mockFind.mockReturnValue({
    sort,
  });

  mockCountDocuments.mockResolvedValue(1);

  const result = await repository.findAll({
    eventType: "USER_CREATED",
    source: "auth-service",
  });

  expect(mockFind).toHaveBeenCalledWith({
    eventType: "USER_CREATED",
    source: "auth-service",
  });

  expect(mockCountDocuments).toHaveBeenCalledWith({
    eventType: "USER_CREATED",
    source: "auth-service",
  });

  expect(result.events).toHaveLength(1);

  expect(result.events[0]).toEqual({
    _id: "mongo-event-005",
    eventType: "USER_CREATED",
    source: "auth-service",
    payload: {
      userId: "user-005",
    },
    createdAt: new Date("2026-10-01T13:00:00.000Z"),
  });

  expect(result.total).toBe(1);
});


test("should paginate events correctly", async () => {
  const repository = new EventMongoRepositery();

  const events = [
    {
      _id: {
        toString: () => "mongo-event-011",
      },
      eventType: "USER_LOGIN",
      source: "auth-service",
      payload: {
        userId: "user-011",
      },
      createdAt: new Date("2026-10-01T11:00:00.000Z"),
    },
  ];

  const lean = jest.fn().mockResolvedValue(events);

  const limit = jest.fn().mockReturnValue({
    lean,
  });

  const skip = jest.fn().mockReturnValue({
    limit,
  });

  const sort = jest.fn().mockReturnValue({
    skip,
  });

  mockFind.mockReturnValue({
    sort,
  });

  mockCountDocuments.mockResolvedValue(21);

  const result = await repository.findAll(
    {},
    {
      page: 2,
      limit: 10,
    }
  );

  expect(mockFind).toHaveBeenCalledWith({});

  expect(sort).toHaveBeenCalledWith({
    createdAt: -1,
  });

  expect(skip).toHaveBeenCalledWith(10);

  expect(limit).toHaveBeenCalledWith(10);

  expect(lean).toHaveBeenCalledTimes(1);

  expect(mockCountDocuments).toHaveBeenCalledWith({});

  expect(result.events).toHaveLength(1);

  expect(result.total).toBe(21);
});