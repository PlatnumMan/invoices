import bcrypt from "bcryptjs";
import "dotenv/config";
import mongoose from "mongoose";
import validator from "validator";
import { USER } from "../constants/index.js";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "Email is required"],
      validate: [validator.isEmail, "Invalid email"],
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (value) {
          return /^[A-z][A-z0-9-_]{3,23}$/.test(value);
        },
        message: "Invalid username",
      },
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
      validate: [validator.isAlphanumeric, "Invalid first name"],
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      validate: [validator.isAlphanumeric, "Invalid last name"],
    },

    password: {
      type: String,
      select: false,
      validate: [
        validator.isStrongPassword,
        "Password must be atleast 1 uppercase and lowercase letters and at leat 1 symbol",
      ],
    },

    passwordConfirm: {
      type: String,
      select: false,
      validator: function (value) {
        return value === this.password;
      },
      message: "Passwords do not match",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      required: true,
      default: "email",
    },
    googleID: String,
    avatar: String,
    businessName: String,
    phoneNumber: {
      type: String,
      default: "+33654157852",
      validate: [validator.isMobilePhone, "Invalid phone number"],
    },
    address: String,
    city: String,
    country: String,
    passwordChangedAt: Date,

    roles: {
      type: [String],
      default: [USER],
    },
    active: {
      type: Boolean,
      default: true,
    },
    refreshToken: [String],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.roles.length === 0) {
    this.roles.push(USER);
    next();
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.comparePassword = async function (givenPassword) {
  return await bcrypt.compare(givenPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
