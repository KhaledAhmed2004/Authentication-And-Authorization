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

# 🚀 User Management Implementation

This guide provides a structured approach to implementing user management in a Node.js application using TypeScript, MongoDB with Mongoose, Zod validation, and Express.

## 📌 Steps Overview

1. [Creating Users in the Database](#creating-users-in-the-database)
2. [Fetching All Users](#fetching-all-users)
3. [Fetching a Single User](#fetching-a-single-user)
4. [Password Hashing with Mongoose](#password-hashing-with-mongoose)
5. [Enhancing Password Security](#enhancing-password-security)

## 1️⃣ **Creating Users in the Database**

### Step 1: **Define User Interface in TypeScript**

To ensure type safety and consistency, create a TypeScript interface for user data.

```typescript
export type TCreateUser = {
  email: string;
  password: string;
  role: "user" | "admin";
  status: "active" | "blocked";
  isDeleted: boolean;
};
```

### Step 2: **Define Mongoose Schema and Model**

Use the TypeScript interface to define a Mongoose schema for storing user data in the MongoDB database.

```typescript
import { model, Schema } from "mongoose";
import { TCreateUser } from "./user.interface";

const userSchema = new Schema<TCreateUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    status: { type: String, enum: ["active", "blocked"], default: "active" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = model<TCreateUser>("User", userSchema);
```

### Step 3: **Implement Zod Validation**

Validate incoming data before processing it using Zod for runtime validation.

```typescript
import { z } from "zod";

const userValidationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  role: z.enum(["user", "admin"]).default("user"),
  status: z.enum(["active", "blocked"]).default("active"),
  isDeleted: z.boolean().default(false),
});

export const UserValidation = { userValidationSchema };
```

### Step 4: **Create Controller for User Registration**

Create a controller to handle the registration of new users.

```typescript
import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const createUser: RequestHandler = catchAsync(async (req, res) => {
  const userData = await req?.body;
  const user = await UserServices.createUserIntoDB(userData);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

export const UserControllers = { createUser };
```

### Step 5: **Create Service for User Registration**

The service contains the logic to interact with the database and create the user.

```typescript
import { TCreateUser } from "./user.interface";
import { User } from "./user.model";

const createUserIntoDB = async (userData: TCreateUser) => {
  const create = await User.create(userData);
  return create;
};

export const UserServices = { createUserIntoDB };
```

### Step 6: **Define Router for User Registration**

Define the route for creating a new user.

```typescript
router.post("/create-user", UserControllers.createUser);
```

---

## 2️⃣ **Fetching All Users from Database**


### Step 1: **Create Controller to Fetch All Users**

This controller handles the request to fetch all users from the database.

```typescript
import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const getAllUsersFromDB: RequestHandler = async (req, res) => {
  const users = await UserServices.getAllUsersFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "List of users",
    data: users,
  });
};

export const UserControllers = { getAllUsersFromDB };
```

### Step 2: **Create Service to Fetch All Users**

The service interacts with the database to fetch the users.

```typescript
const getAllUsersFromDB = async () => {
  const users = await User.find();
  return users;
};

export const UserServices = { getAllUsersFromDB };
```

### Step 3: **Define Router for Fetching All Users**

Define the route to fetch all users.

```typescript
router.get("/users", UserControllers.getAllUsersFromDB);
```

---

## 3️⃣ **Fetching a Single User from Database**

### Step 1: **Create Controller to Fetch a Single User**

This controller handles the request to fetch a single user based on their `id`.

```typescript
import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const getSingleUserFromDB: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const user = await UserServices.getSingleUserFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User details",
    data: user,
  });
};

export const UserControllers = { getSingleUserFromDB };
```

### Step 2: **Create Service to Fetch a Single User**

The service retrieves a user by their `id`.

```typescript
const getSingleUserFromDB = async (id: string) => {
  const user = await User.findById(id);
  return user;
};

export const UserServices = { getSingleUserFromDB };
```

### Step 3: **Define Router for Fetching a Single User**

Define the route to fetch a single user by `id`.

```typescript
router.get("/user/:id", UserControllers.getSingleUserFromDB);
```

## 4️⃣  **Password Hashing Using Mongoose `pre` and `post` Hooks**
Storing plain-text passwords in the database is a significant security risk. To mitigate this, we must hash the passwords before storing them. Mongoose's `pre` hook middleware is an excellent tool for securely hashing passwords just before saving user documents to the database.

### 🔐 **How It Works**

#### 1. **What is a Mongoose `pre` Hook?**
A `pre` hook in Mongoose is middleware that runs before a specific action, such as saving (`save`) or validating a document. It is an excellent place to perform tasks like hashing a password because it allows you to modify the data before it is written to the database.

#### 2. **Hashing a Password**
Password hashing is the process of converting a password into a random string of characters using a one-way algorithm. The most commonly used library for this in Node.js is **bcrypt**.

### 🛠 **Implementation Steps**

#### Step 1: **Install `bcrypt`**
First, install the `bcrypt` library, which will be used to hash passwords.

```bash
npm install bcrypt
```

#### Step 2:**Define the User Schema**

Create a Mongoose schema for your users and specify a `password` field. Below is an example schema:

```typescript
import { Schema, model } from "mongoose";

// User schema definition
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // other fields...
});
```

#### Step 3: **Hash Password Using `pre` Hook**

In the schema's `pre` hook for the `save` operation, hash the password before saving the document. Use bcrypt to ensure secure password storage:

```typescript
// `pre` hook to hash the password before saving
userSchema.pre("save", async function (next) {
  const user = this;  // `this` refers to the current document

  // Hash the password before saving
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round) // Salt rounds from the config
  );
  next(); // Continue with the save operation
});
```
- **`const user = this`:**
  In this middleware, `this` refers to the current document being saved to the database. For example, if a new user is being created, this holds the new user’s data.
- **`user.password`**: Refers to the plain-text password entered by the user.
- **`bcrypt.hash()`**: Hashes the password using the specified number of salt rounds (more rounds = more secure).
- **`next()`**: After the password is hashed, `next()` is called to continue with the save operation.






### Step 4: **Clear Password in `post` Hook**

After the password is hashed and saved to the database, we clear the password from the response to ensure it's never exposed in the API response.

```typescript
// `post` hook to clear password from the saved document before sending response
userSchema.post("save", async function (doc, next) {
  doc.password = "";  // Clear the password field in the saved document
  next();  // Continue with the operation
});
```

- **`doc.password = ""`**: Ensures that the hashed password is not included in the API response after saving the user.


## 🌟 Key Features

- **Mongoose Integration**: Easily integrates with MongoDB for managing user data.
- **Zod Validation**: Ensures runtime validation of data to prevent invalid input.
- - **Role-Based Authorization**: `user` and `admin` roles.
- **Secure Password Handling**: Passwords are hashed before storage.
- **Data Validation**: Zod ensures runtime validation.


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


