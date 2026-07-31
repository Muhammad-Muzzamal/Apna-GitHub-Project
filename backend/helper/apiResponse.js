exports.successResponse = (res, message, data = null, statusCode = 200) => {
    return res.status(statusCode).json({
        status: "success",
        message: message,
        data: data,
        status_code: statusCode
    });
}

exports.errorResponse = (res, message, statusCode = 500) => {
    return res.status(statusCode).json({
        status: "error",
        message: message,
        status_code: statusCode
    })
}