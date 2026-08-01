// Express.js error handler middleware for ToDo API
// TODO: implement

const errorHandlerMiddleware = (err, req, res, next) => {
    const statusCode = err.status || err.statusCode || 500;

    res.status(statusCode).json({
        error: err.message || 'Something went wrong',
    });
}
module.exports = errorHandlerMiddleware;