const {
  EventController,
} = require("../dist/Interfaces/http/controllers/event.controller");

describe("EventController", () => {
  let createEvent;
  let getEvents;
  let controller;

  let req;
  let res;
  let next;

  beforeEach(() => {
    createEvent = {
      excute: jest.fn(),
    };

    getEvents = {
      excute: jest.fn(),
    };

    controller = new EventController(
      createEvent,
      getEvents
    );

    req = {
      body: {},
      query: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    next = jest.fn();
  });

  test("should create an event and return 201", async () => {
    const body = {
      eventType: "USER_CREATED",
      source: "auth-service",
      payload: {
        userId: "user-001",
      },
    };

    req.body = body;

    await controller.create(req, res, next);

    expect(createEvent.excute).toHaveBeenCalledTimes(1);
    expect(createEvent.excute).toHaveBeenCalledWith(body);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "event created successfuly",
    });
  });

  test("should get events with filters and pagination", async () => {
    req.query = {
      eventType: "USER_CREATED",
      source: "auth-service",
    };

    req.validatedQuery = {
      page: 2,
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
      total: 21,
    };

    getEvents.excute.mockResolvedValue(result);

    await controller.getAll(req, res, next);

    expect(getEvents.excute).toHaveBeenCalledTimes(1);

    expect(getEvents.excute).toHaveBeenCalledWith(
      {
        eventType: "USER_CREATED",
        source: "auth-service",
      },
      {
        page: 2,
        limit: 10,
      }
    );

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      events: result.events,
      pagination: {
        page: 2,
        limit: 10,
        total: 21,
        totalPages: 3,
      },
    });
  });

  test("should get events without filters", async () => {
    req.query = {};

    req.validatedQuery = {
      page: 1,
      limit: 10,
    };

    const result = {
      events: [],
      total: 0,
    };

    getEvents.excute.mockResolvedValue(result);

    await controller.getAll(req, res, next);

    expect(getEvents.excute).toHaveBeenCalledWith(
      {
        eventType: undefined,
        source: undefined,
      },
      {
        page: 1,
        limit: 10,
      }
    );

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      events: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    });
  });
  test("should propagate create event errors", async () => {
  const createError = new Error("failed to create event");

  createEvent.excute.mockRejectedValue(createError);

  req.body = {
    eventType: "USER_CREATED",
    source: "auth-service",
    payload: {
      userId: "user-001",
    },
  };

  await expect(
    controller.create(req, res, next)
  ).rejects.toThrow("failed to create event");

  expect(createEvent.excute).toHaveBeenCalledWith(req.body);
  expect(res.status).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
});

test("should propagate get events errors", async () => {
  const getEventsError = new Error("failed to fetch events");

  getEvents.excute.mockRejectedValue(getEventsError);

  req.query = {
    eventType: "USER_CREATED",
  };

  req.validatedQuery = {
    page: 1,
    limit: 10,
  };

  await expect(
    controller.getAll(req, res, next)
  ).rejects.toThrow("failed to fetch events");

  expect(getEvents.excute).toHaveBeenCalledWith(
    {
      eventType: "USER_CREATED",
      source: undefined,
    },
    {
      page: 1,
      limit: 10,
    }
  );

  expect(res.status).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
});
});