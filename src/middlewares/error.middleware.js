const appErrorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode
    console.log("ERROR :", error)
    res.status(error.statusCode).json({
        success: false,
        message: error.message
    })
}

module.exports = appErrorHandler
