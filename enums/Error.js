const ERROR = {
  USER_ALREADY_EXISTS: "User already exists",
  OWNER_ALREADY_EXISTS: "Owner already exists",
  INVALID_EMAIL_OR_PASSWORD: "Invalid email or password",
  SERVER_ERROR: "Something went wrong. Please try again later.",
  UNAUTHORIZED: "Access denied. No token provided.",
  FORBIDDEN: "Access forbidden. Invalid token.",
  VALIDATION_ERROR: "Validation failed. Check your input.",
  RECIPE_NOT_FOUND: "Recipe not found",
  USER_NOT_FOUND: "User not found",
  OWNER_NOT_FOUND: "Owner not found",
  EMAIL_REQUIRED: "Email is required",
  PASSWORD_REQUIRED: "Password is required",
  INVALID_TOKEN: "Invalid or expired token."
};

module.exports = ERROR;