import apiResponse from "../utils/apiResponse.js";

export const healthcheck = (req, res, next) => {
  try {
    res
      .status(200)
      .json(new apiResponse(200, { message: "Server is running" }));
  } catch (err) {
    
  }
};
