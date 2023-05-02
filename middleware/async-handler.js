//Handles function to wrap each route
exports.asyncHandler = (cb) => {
    return async (req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (error) {
            //forwards error to the global  error handler
            next(error);
        }
    }
}