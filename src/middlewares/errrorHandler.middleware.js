const errorHandler = (error, req, res) => {
  console.log(error);
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server errror";

  res.status(statusCode).json({
    sucess: false,
    message,
    errors: error.errors ? [...error.errors] : "",
  });
};
