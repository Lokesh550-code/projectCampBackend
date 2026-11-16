import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail, emailVerificationMailgenContent } from "../utils/mail.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access or refresh token",
    );
  }
};

export const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password, role, fullname } = req.body;

  const existingUser = await User.findOne({
    $or: [{ username, email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with same username or email already exists");
  }

  const user = await User.create({
    username,
    fullname,
    email,
    password,
    isEmailVerified: false,
  });

  await generateAccessAndRefreshTokens(user?._id);

  const { unHashedToken, hashToken, tokenExpriy } =
    await user.generateTemporaryToken();

  user.emailVerificationToken = hashToken;
  user.emailVerificationExpiry = tokenExpriy;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user?.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user?.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,
    ),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -isEmailVerified -forgotPasswordToken -forgotPasswordExpiry -emailVerificationToken -emailVerificationExpiry",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering a user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: createdUser },
        "User registered successfully, and verrification email has been sent on your email",
      ),
    );
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User does not exists");
  }

  const isPasswordCorrect = await user.verifyPassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -isEmailVerified -forgotPasswordToken -forgotPasswordExpiry -emailVerificationToken -emailVerificationExpiry",
  );

  if (!loggedInUser) {
    throw new ApiError(500, "Something went wrong while logging in ");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser },
        "User logged in successfully",
      ),
    );
});
