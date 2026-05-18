# StayGrid

**Production-grade hotel booking backend** - built to handle the problems real booking platforms actually face: concurrency, dynamic pricing, inventory consistency, and payment workflows.

> Not another CRUD project. StayGrid is designed around production engineering concerns from the ground up.

---

## Table of Contents

- [Overview](#overview)
- [Development Highlights](#development-highlights)
- [Tech Stack](#tech-stack)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Screenshots](#screenshots)
- [Deployment](#deployment)
- [Author](#author)

---

## Overview

StayGrid simulates the backend of a real hotel booking platform — the kind where two users can attempt to book the same room at the same time, pricing changes by the hour, and a failed payment still needs to leave inventory clean.

**Core problem domains this project addresses:**
- Race conditions in concurrent booking requests
- Multi-layered dynamic pricing logic
- Atomic inventory updates across multi-day stays
- Reliable payment processing with Stripe webhooks

---

## Development Highlights

### Stateless Authentication & Authorization
- JWT-based auth with a short-lived access token + refresh token flow
- Refresh tokens stored in `HttpOnly` cookies to prevent XSS exposure
- Role-based access control: `HOTEL_MANAGER` and `GUEST` roles with endpoint-level authorization

---

### Inventory System with Overbooking Prevention
The most critical layer — two users booking the same room simultaneously must never both succeed.

- **Pessimistic locking** (`SELECT FOR UPDATE`) to serialize concurrent writes
- **Reserved vs. Booked** state separation to handle the window between intent and payment
- **Multi-day availability validation** across the full stay duration
- Atomic inventory updates within transactions to ensure consistency

---

### Real Payment Integration via Stripe
- Stripe Checkout session creation per booking
- **Webhook-driven confirmation** — payment status is never polled, always pushed
- Automatic refund on cancellation
- **Idempotent booking confirmation** to handle duplicate webhook delivery safely

---

### Dynamic Pricing Engine (Strategy Pattern)
Pricing is not a single formula — it's a composable pipeline of strategies applied in sequence:

| Layer | Description |
|---|---|
| Base Price | Room's configured nightly rate |
| Surge Multiplier | Demand-based scaling |
| Occupancy Pricing | Adjusts with current fill rate |
| Urgency Pricing | Increases for near-date bookings |
| Holiday Adjustment | Applies calendar-based modifiers |

Each strategy is independently pluggable — new pricing rules can be added without touching existing logic.

---

### Scheduled Price Optimization
- Hourly background job (`@Scheduled`) recalculates room prices
- Updates minimum price aggregates per hotel
- Designed for batch-scale operation

---

### Full Booking Lifecycle

```
RESERVED → GUESTS_ADDED → PAYMENTS_PENDING → CONFIRMED
                                           ↘ CANCELLED
                                           ↘ EXPIRED
```

- **10-minute expiry window** on reserved bookings — automatically released if payment doesn't complete
- Ownership validation on every state transition
- Transactional consistency enforced end-to-end

---

### Query Optimization & Aggregations
- Custom JPQL queries for availability filtering, pricing aggregation, and revenue reporting
- Avoids N+1 with fetch strategies and projection-based queries

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 4 |
| Security | Spring Security + JWT |
| Database | PostgreSQL (Neon Serverless) |
| ORM | Hibernate / JPA |
| Payments | Stripe API |
| API Docs | Swagger / OpenAPI |
| Mapping | ModelMapper |

---

## API Reference

Interactive API documentation available at:

```
http://localhost:8080/api/v1/swagger-ui/index.html
```

---

## Testing

All flows tested end-to-end via Postman collections:

- Auth flow (register, login, token refresh)
- Booking lifecycle (reserve → confirm → cancel)
- Payment simulation (Stripe test mode + webhook replay)
- Admin and Hotel Manager operations

---

## Screenshots

> _Coming soon — Swagger UI, booking flow, and inventory locking demonstration_

---

## Deployment

> _Free-tier cloud deployment in progress_

---

## Author

**Smit Roy**
[github.com/smitroy4](https://github.com/smitroy4)

---

⭐ If this project was useful or interesting, feel free to star the repo.
