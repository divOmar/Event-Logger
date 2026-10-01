# Event Log Service

A scalable event-driven Event Log Service built with Node.js, TypeScript, Express.js, MongoDB, Kafka, Docker, and Kubernetes.

The service receives events through an HTTP API, persists them in MongoDB, publishes them to Kafka, and consumes Kafka events with retry and Dead Letter Topic (DLT) handling.

## Architecture

```text
                    ┌──────────────────┐
                    │      Client      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Express API    │
                    └────────┬─────────┘
                             │
                 ┌───────────┴───────────┐
                 │                       │
                 ▼                       ▼
          ┌─────────────┐         ┌─────────────┐
          │   MongoDB   │         │    Kafka    │
          │ Event Store │         │    events   │
          └─────────────┘         └──────┬──────┘
                                         │
                                         ▼
                                  ┌─────────────┐
                                  │   Consumer  │
                                  └──────┬──────┘
                                         │
                                         ▼
                                  ┌─────────────┐
                                  │  Processing │
                                  └──────┬──────┘
                                         │
                                  failure after
                                     retries
                                         │
                                         ▼
                                  ┌─────────────┐
                                  │ events.dlt  │
                                  └─────────────┘
```

## Tech Stack

- Node.js
- TypeScript
- Express.js
- MongoDB
- Mongoose
- Apache Kafka
- KafkaJS
- Docker
- Docker Compose
- Kubernetes
- Jest
- Supertest
- class-validator
- Pino

## Project Structure

```text
src/
├── Application/
│   └── events/
├── Domain/
│   └── events/
├── Infrastructure/
│   ├── Kafka/
│   ├── logging/
│   ├── mongodb/
│   └── events/
├── Interfaces/
│   └── http/
├── Middleware/
├── Types/
├── app.ts
└── server.ts

tests/

k8s/
├── app-deployment.yaml
├── app-service.yaml
├── kafka-deployment.yaml
├── kafka-service.yaml
├── mongodb-deployment.yaml
└── mongodb-service.yaml
```

## Environment Variables

Create a `.env` file:

```env
PORT=3000
NODE_ENV=development
DB_URL=mongodb://localhost:27017/event-log-service
KAFKA_BROKERS=localhost:9092
KAFKA_TOPIC=events
KAFKA_DLT_TOPIC=events.dlt
```

For Docker Compose:

```env
PORT=3000
NODE_ENV=development
DB_URL=mongodb://mongodb:27017/event-log-service
KAFKA_BROKERS=kafka:9092
KAFKA_TOPIC=events
KAFKA_DLT_TOPIC=events.dlt
```

`.env` is ignored by Git. Use `.env.example` as the configuration template.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Run Production Build

```bash
npm start
```

## Testing

Run the complete test suite:

```bash
npm test -- --runInBand
```

The project currently contains:

```text
14 test suites
55 tests
```

## Docker Compose

Start the complete infrastructure:

```bash
docker compose up -d --build
```

Check services:

```bash
docker compose ps
```

Stop the services:

```bash
docker compose down
```

The Compose environment contains:

- Event Log Service
- MongoDB
- Kafka

## Kubernetes

The project includes Kubernetes manifests under `k8s/`.

Apply them:

```bash
kubectl apply -f k8s/
```

Check Pods:

```bash
kubectl get pods
```

Check Services:

```bash
kubectl get services
```

The Kubernetes deployment contains:

- Event Log Service
- MongoDB
- Kafka

The application uses Kubernetes Services for internal communication:

```text
event-log-service
mongodb
kafka
```

The application image is configured with:

```yaml
imagePullPolicy: Never
```

This allows Docker Desktop Kubernetes to use the locally built image.

## API

### Health Check

```http
GET /health
```

Example response:

```json
{
  "success": true,
  "status": "ok"
}
```

### Liveness Check

```http
GET /health/live
```

Example response:

```json
{
  "success": true,
  "status": "alive"
}
```

### Create Event

```http
POST /events
Content-Type: application/json
```

Example:

```json
{
  "eventType": "USER_CREATED",
  "source": "auth-service",
  "payload": {
    "userId": "user-001",
    "email": "user@example.com"
  }
}
```

### Get Events

```http
GET /get-events
```

Pagination:

```http
GET /get-events?page=1&limit=10
```

Filtering:

```http
GET /get-events?eventType=USER_CREATED
```

```http
GET /get-events?source=auth-service
```

Filtering and pagination can be combined:

```http
GET /get-events?eventType=USER_CREATED&source=auth-service&page=1&limit=10
```

Example response:

```json
{
  "success": true,
  "events": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

## Kafka

The service uses two Kafka topics:

```text
events
events.dlt
```

### Events Topic

Normal events are published to:

```text
events
```

The consumer processes events from this topic.

### Dead Letter Topic

When event processing fails after the configured retry attempts, the event is published to:

```text
events.dlt
```

The DLT message contains:

- Original event
- Error message
- Retry count
- Failure timestamp

## Event Processing

The consumer validates incoming Kafka messages before processing them.

Processing flow:

```text
Kafka Message
     │
     ▼
Parse JSON
     │
     ▼
Validate Event
     │
     ├── Invalid ──► Log Error
     │
     ▼
Process Event
     │
     ├── Success ──► Mark Processed
     │
     ▼
Retry on Failure
     │
     ├── Success ──► Mark Processed
     │
     └── All Retries Failed
                 │
                 ▼
                DLT
```

Processed events are tracked in MongoDB to provide idempotent processing.

## Design

The project follows a layered architecture inspired by Domain-Driven Design:

```text
Interfaces
    │
    ▼
Application
    │
    ▼
Domain
    ▲
    │
Infrastructure
```

The application layer does not directly depend on MongoDB or Kafka implementations. Interfaces are used to keep infrastructure concerns separated from business logic.

## Reliability Features

The service includes:

- Input validation
- Environment validation
- Kafka retry handling
- Dead Letter Topic handling
- Idempotent event processing
- MongoDB indexes
- Pagination
- Event filtering
- Structured logging
- Health checks
- Kubernetes readiness probe
- Kubernetes liveness probe
- Docker containerization
- Automated tests

## Future Improvements

Potential future improvements include:

- Kafka authentication and TLS
- MongoDB authentication
- Kubernetes Secrets and ConfigMaps
- Horizontal Pod Autoscaling
- Persistent Kafka and MongoDB volumes
- Distributed tracing
- Metrics and monitoring
- More comprehensive end-to-end tests
- CI/CD pipeline
