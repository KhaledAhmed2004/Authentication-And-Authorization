# Project Title

## 🔑 **Authentication** – Who Are You?

Authentication is the process of verifying the identity of a user. It involves checking if the user is who they say they are by comparing their credentials (like username, email, or password) with what's stored in the system.

### Example Authentication Route:
- `/auth/login`

For having batter understed we alwyes use "auth" before the route.This is the route where a user would submit their login credentials. The system will then check if the entered data matches the stored data in the database to verify the user's identity.

---

## 🔓 **Authorization** – What Are You Allowed to Do?

Authorization is the process of determining what actions or resources a user is allowed to access once they are authenticated.

After the system verifies the user's identity, it checks the user's permissions (roles, privileges, etc.) to determine what they are allowed to do.

For example, a regular user might only be able to view their profile and book a car, while an admin user can manage cars, bookings, and user accounts.
