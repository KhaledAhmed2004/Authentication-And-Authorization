# User Managment Sysmte Project 🚀

## 📋 Overview
The Project focuses on building a **user management system** that supports **role-based authorization** and **secure password handling**. The implementation includes creating TypeScript interfaces, Mongoose models, and adding runtime data validation using **Zod**.

## 🔑 **Authentication** – Who Are You?

Authentication is the process of verifying the identity of a user. It involves checking if the user is who they say they are by comparing their credentials (like username, email, or password) with what's stored in the system.

### Example Authentication Route:
- `/auth/login`

For having batter understed we alwyes use "auth" before the route.This is the route where a user would submit their login credentials. The system will then check if the entered data matches the stored data in the database to verify the user's identity.

---

## 🔓 **Authorization** – What Are You Allowed to Do?

Authorization is the process of determining what actions or resources a user is allowed to access once they are authenticated.

After the system verifies the user's identity, it checks the user's permissions (roles, privileges, etc.) to determine what they are allowed to do.

For example:
- A regular user might only be able to view their profile and book a car.
- An admin user can manage cars, bookings, and user accounts.

## 🚀 Implementation Steps

### Step 1: **Create a User Interface in TypeScript**

Begin by defining a TypeScript interface for consistent and type-safe user data across the application. This structure ensures uniformity for user-related operations.

```typescript
export type TCreateUser = {
  email: string;
  password: string;
  role: "user" | "admin";
  status: "active" | "block";
  isDeleted: boolean;
};

```

### Step 2: **Define a Mongoose Schema and Model**

To store and manage user data in the database, define a Mongoose schema that mirrors the structure of the user interface.

```typescript
import { model, Schema } from "mongoose";
import { TCreateUser } from "./user.interface";

const userSchema = new Schema<TCreateUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);
export const User = model<TCreateUser>("User", userSchema);

```

### Step 3: **Implement Zod Validation**

To ensure the integrity of the data before interacting with the database, implement **Zod validation** for runtime checks. This prevents invalid or incomplete data from being processed.

```typescript
import { z } from "zod";

const userValidactionSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  role: z.enum(["user", "admin"]).default("user"),
  status: z.enum(["active", "blocked"]).default("active"),
  isDeleted: z.boolean().default(false),
});

export const UserValidaction = { userValidactionSchema };
```

## 🌟 Key Features

- **Role-Based Authorization**: Supports user roles (`user` and `admin`), allowing for flexible user access control.
- **Mongoose Integration**: Easily integrates with MongoDB for managing user data.
- **Zod Validation**: Ensures runtime validation of data to prevent invalid input.

## 🚧 Planned Enhancements

- **JWT Authentication**: Implement secure token-based authentication.
- **Email Verification**: Add functionality for verifying user email addresses.
- **Enhanced Error Handling**: Improve error messages and add custom error pages.

## 📦 Dependencies

- `mongoose`: MongoDB Object Data Modeling (ODM) library
- `zod`: Schema validation library for runtime checks
- `bcryptjs`: For securely hashing passwords

## ⚡️ Getting Started

Follow these steps to set up the project:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure MongoDB**: Set up your MongoDB database and update the connection URL in the environment variables.

4. **Run the server**:
   ```bash
   npm start
   ```

---

This version is structured with easy-to-read sections, clear headings, and well-organized code snippets, making the README both visually appealing and informative.
