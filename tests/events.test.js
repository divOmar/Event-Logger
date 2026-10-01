const request = require("supertest");

describe("Events API", () => {
  test("POST /events should create an event", async () => {
    const response = await request("http://localhost:3000")
      .post("/events")
      .send({
        eventType: "USER_CREATED",
        source: "test-service",
        payload: {
          userId: "integration-test-001",
          email: "test@example.com",
        },
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});


test("POST /events should reject invalid data", async () => {
  const response = await request("http://localhost:3000")
    .post("/events")
    .send({
      source: "test-service",
      payload: {
        userId: "integration-test-002",
      },
    });

  expect(response.status).toBe(400);
});






test("GET /get-events should return events", async () => {
  const response = await request("http://localhost:3000")
    .get("/get-events");

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(Array.isArray(response.body.events)).toBe(true);
});





test("GET /get-events should support pagination", async () => {
  const response = await request("http://localhost:3000")
    .get("/get-events")
    .query({
      page: 1,
      limit: 10,
    });

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(Array.isArray(response.body.events)).toBe(true);
});