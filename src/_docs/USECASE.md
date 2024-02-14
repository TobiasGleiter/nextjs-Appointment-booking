# 🏴‍☠️ Use Cases

## ❓ Frequently Asked Questions

- **What are the Use Cases?**

---

## What are the Use Cases?

Two selected use cases:

### Case One

- User 1 wants to book an appointment at 12:00 PM 15.02.2024 for 30 minutes.
- User 2 wants to book an appointment at 12:30 OM 15.02.2024 for 30 minutes.

The process should be successful for both users.

### Case Two

- User 1 wants to book an appointment at 12:00 PM 15.02.2024 for 30 minutes.
- User 2 wants to book an appointment at 12:00 OM 15.02.2024 for 30 minutes.

At least one of the users should get the feedback that the booking is not possible.

| Appointment | Type   | Description                            |
| ----------- | ------ | -------------------------------------- |
| bookedAt    | Date   | Appointment start date                 |
| email       | String | Email of the Customer                  |
| name        | String | Name of the Customer                   |
| notes       | String | Any additional notes from the Customer |
