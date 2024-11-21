import {ApiError} from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  // Check if the error is an instance of ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // For unknown errors, return a generic error message
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: [err.message],
  });
};

export {errorHandler};
