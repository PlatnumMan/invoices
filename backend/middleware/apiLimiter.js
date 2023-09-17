import rateLimit from "express-rate-limit";
// import { systemLogs } from "../utils/Logger.js";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
  handler: (req, res, next, options) => {
    // systemLogs.error(
    //   `Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`
    // );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export const loginLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    message:
      "Too many login attempts from this IP, please try again after 30 minutes",
  },
  handler: (req, res, next, options) => {
    // systemLogs.error(
    //   `Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`
    // );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
