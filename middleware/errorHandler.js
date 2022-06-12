const ErrorResponse = require("../utils/errorResponse")

const errorHandler = (err, req, res, next) => {
	let error = { ...err }

	error.message = err.message

	// Log to cnsole for dev
	// console.log(err.stack)
	console.log(err)
	// console.log(err.name)

	// Mongoose bad OjbectID
	if (err.name === "CastError") {
		const message = `Resource not found with id of ${err.value}`
		error = new ErrorResponse(message, 404)
	}

	// Mongoose duplicate key
	if (err.code === 11000) {
		const message = `Duplicate field value entered: ${Object.values(
			err.keyValue
		)}`
		error = new ErrorResponse(message, 400)
	}

	// Mongoose validation error
	if (err.name === "ValidationError") {
		const message = Object.values(err.errors).map(val => val.message)
		error = new ErrorResponse(message, 400)
	}

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || "Server error",
	})
}

module.exports = errorHandler
