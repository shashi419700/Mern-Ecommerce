export const errorMiddleware = (err, req, res, next) => {
    err.message || (err.message = "eevvvdx");
    err.statusCode || (err.statusCode = 500);
    if (err.name === "CastError")
        err.message = "Invalid ID";
    return res.status(err.statusCode).json({
        success: true,
        message: err.message,
    });
};
export const Trycatch = (fun) => {
    return (req, res, next) => {
        Promise.resolve(fun(req, res, next)).catch(next);
    };
};
