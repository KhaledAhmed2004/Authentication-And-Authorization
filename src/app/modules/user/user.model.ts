import { model, Schema } from "mongoose";
import { TCreateUser, UserModel } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../config";
import { UserStatus } from "./user.constant";

// Define the user schema using the Mongoose Schema class
const userSchema = new Schema<TCreateUser, UserModel>(
  {
    firstName: {
      type: String, // Specifies the data type for the field.
      required: true, // Indicates that the field is mandatory.
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate are stored in the database.
    },
    password: {
      type: String,
      required: true,
      select: 0, // Excludes the password field from the query results.
    },

    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Restricts the value of the role field to either "user" or "admin".
      default: "user", // Sets the default value of the role field to "user".
    },
    status: {
      type: String,
      enum: UserStatus,
      default: "active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields to the schema.
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  // hash the password before saving the user
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round)
  );
  next();
});

userSchema.post("save", async function (doc, next) {
  doc.password = "";
  next();
});

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select("+password");
};

userSchema.statics.isPasswordMatch = async function (
  plainTextPassword: string,
  hashedPassword: string
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.ifJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIccsuTimestamp: number
) {
  // Check if the JWT was issued before the password was changed
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;

  return passwordChangedTime > jwtIccsuTimestamp;
};

// This model will be used to interact with the `users` collection in the database.
export const User = model<TCreateUser, UserModel>("User", userSchema);
