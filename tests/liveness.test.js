const request = require("supertest");

describe("Liveness API", () => {
  test("GET /health/live should return 200", async () => {
    const response = await request("http://localhost:3000")
      .get("/health/live");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe("alive");
  });
});