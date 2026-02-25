const appErrorHandler = (error, req, res, next) => {
    console.log("ERROR : ",error)
    const statusCode = error.statusCode
    res.status(error.statusCode).json({
        success: false,
        message: error.message
    })
}

module.exports = appErrorHandler
