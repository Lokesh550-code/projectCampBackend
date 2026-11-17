import { body } from "express-validator";

export const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username must be in lowercase")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 character long")
      .isLength({ max: 8 })
      .withMessage("Username must be at most 8 characters long"),
    body("password").trim().notEmpty().withMessage("Password is required"),
    body("fullname")
      .trim()
      .notEmpty()
      .withMessage("full name is required")
      .isLength({ min: 3 })
      .withMessage(),
  ];
};

export const userLoginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invaid email"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ];
};

export const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword")
      .trim()
      .notEmpty()
      .withMessage("Old password is required"),
    bosy("newPassword")
      .trim()
      .notEmpty()
      .withMessage("New password is required"),
  ];
};

export const userFrogotPasswordValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty("Email is required")
      .isEmail()
      .withMessage("Invalid email"),
  ];
};

export const userResetForgotPasswordValidator = () => {
  return [
    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("New password is required"),
  ];
};
