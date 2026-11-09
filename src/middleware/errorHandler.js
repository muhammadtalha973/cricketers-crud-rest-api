function notFoundHandler(req, res) {
  res.status(404).json({
    error: "Not Found",
    message: `No route matches ${req.method} ${req.originalUrl}.`
  });
}

function errorHandler(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      error: "Invalid JSON",
      message: "Request body must be valid JSON."
    });
  }

  console.error(err);
  return res.status(500).json({
    error: "Internal Server Error",
    message: "An unexpected error occurred."
  });
}

module.exports = { notFoundHandler, errorHandler };
