const {
  validateDto,
} = require("../dist/Middleware/validation.middleware");

const {
  createEventDto,
} = require("../dist/Application/events/create-event.dto");

const {
  EventPaginationDto,
} = require("../dist/Application/events/event-pagination.dto");

describe("validateDto", () => {
  test("should call next and transform a valid body", async () => {
    const req = {
      body: {
        eventType: "USER_CREATED",
        source: "auth-service",
        payload: {
          userId: "user-001",
        },
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    const middleware = validateDto(createEventDto, "body");

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);

    expect(req.body).toEqual(
      expect.objectContaining({
        eventType: "USER_CREATED",
        source: "auth-service",
        payload: {
          userId: "user-001",
        },
      })
    );

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test("should return 400 when body validation fails", async () => {
    const req = {
      body: {
        eventType: "",
        source: "",
        payload: "invalid-payload",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    const middleware = validateDto(createEventDto, "body");

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "validation failed",
        errors: expect.any(Array),
      })
    );

    expect(next).not.toHaveBeenCalled();
  });

  test("should validate query parameters and store validatedQuery", async () => {
    const req = {
      query: {
        page: "2",
        limit: "10",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    const middleware = validateDto(
      EventPaginationDto,
      "query"
    );

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);

    expect(req.validatedQuery).toEqual(
      expect.objectContaining({
        page: 2,
        limit: 10,
      })
    );

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test("should return 400 when query validation fails", async () => {
    const req = {
      query: {
        page: "invalid",
        limit: "10",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    const middleware = validateDto(
      EventPaginationDto,
      "query"
    );

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "validation failed",
        errors: expect.any(Array),
      })
    );

    expect(next).not.toHaveBeenCalled();
  });
});