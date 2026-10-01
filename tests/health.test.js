const request = require("supertest");

describe("Health API", () => {
  test("GET /health should return 200", async () => {
    const response = await request("http://localhost:3000")
      .get("/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe("ok");
  });
});