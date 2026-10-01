const {
  errorMiddleware,
} = require("../dist/Middleware/error.middleware");

describe("errorMiddleware", () => {
  test("should return a 500 response with a consistent error body", () => {
    const err = new Error("database connection failed");

    const req = {};

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    errorMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "something went wrong",
    });

    expect(next).not.toHaveBeenCalled();
  });
});