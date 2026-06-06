function errorHandler(err, req, res, next) {
  console.error(`[${new Date().toISOString()}] ${err.message}`);

  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
}

function notFound(req, res) {
  res.status(404).json({ success: false, error: `Route ${req.path} not found` });
}

module.exports = { errorHandler, notFound };
