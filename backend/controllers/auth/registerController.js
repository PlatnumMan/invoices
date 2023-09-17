import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import VerificationToken from "../../models/verifyResetTokenModel.js";
import sendEmail from "../../utils/sendEmail.js";

const domainURL = process.env.DOMAIN;

const { randomBytes } = await import("crypto");

// $-title Register User and send verification email
// $-route POST /api/v1/auth/register
// $-access Public

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, firstName, lastName, password, passwordConfirm } =
    req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  if (!username) {
    res.status(400);
    throw new Error("Username is required");
  }

  if (!firstName || !lastName) {
    res.status(400);
    throw new Error("First and Last name are required");
  }

  if (!password) {
    res.status(400);
    throw new Error("Password is required");
  }

  if (!passwordConfirm) {
    res.status(400);
    throw new Error("Password confirmation is required");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const newUser = new User({
    email,
    username,
    firstName,
    lastName,
    password,
    passwordConfirm,
  });

  const registeredUser = await newUser.save();

  if (!registeredUser) {
    res.status(400);
    throw new Error("User not registered");
  }

  // Generate token
  if (registeredUser) {
    const verificationToken = randomBytes(32).toString("hex");

    let emailVerificationToken = await VerificationToken({
      _userId: registeredUser._id,
      token: verificationToken,
    }).save();

    const emailLink = `${domainURL}/api/v1/auth/verify/${emailVerificationToken.token}/${registeredUser._id}`;

    const payload = {
      name: registeredUser.firstName,
      link: emailLink,
    };

    await sendEmail(
      registeredUser.email,
      "Email Verification",
      payload,
      "./emails/template/accountVerification.handlebars"
    );

    res.json({
      success: true,
      message:
        "User registered successfully. Please check your email to verify your account",
    });
  }
});

export default registerUser;
