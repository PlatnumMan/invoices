import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import VerificationToken from "../../models/verifyResetTokenModel.js";
import sendEmail from "../../utils/sendEmail.js";

const domainURL = process.env.DOMAIN;

const { randomBytes } = await import("crypto");

// $-title Verify Email
// $-route GET /api/v1/auth/verify/:token/:id
// $-access Public

const verifyUserEmail = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId }).select(
    "-passwordConfirm"
  );

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isEmailVerified) {
    res.status(400);
    throw new Error("Email already verified");
  }

  const userToken = await VerificationToken.findOne({
    _userId: user._id,
    token: req.params.emailToken,
  });

  if (!userToken) {
    res.status(400);
    throw new Error("Invalid token");
  }

  user.isEmailVerified = true;
  await user.save();

  if (user.isEmailVerified) {
    const emailLink = `${domainURL}/login`;

    const payload = {
      name: user.firstName,
      link: emailLink,
    };

    await sendEmail(
      user.email,
      "Account Verified",
      payload,
      "./emails/template/welcome.handlebars"
    );

    res.redirect("/auth/verify");
  }
});

export default verifyUserEmail;
