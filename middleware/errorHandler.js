const ErrorResponse = require("../utils/errorResponse")

const errorHandler = (err, req, res, next) => {
	let error = { ...err }

	error.message = err.message

	// Log to cnsole for dev
	// console.log(err.stack)
	console.log(err)
	// console.log(err.name)

	let message

	// Mongoose bad OjbectID
	if (err.name === "CastError")
		message = `Resource not found with id of ${err.value}`

	// Mongoose duplicate key
	if (err.code === 11000) {
		message = `Duplicate field value entered: ${Object.values(
			err.keyValue
		)}`

		if (err.keyValue.email)
			message = `A user already exists with the email of ${err.keyValue.email}`
	}

	// Mongoose validation error
	if (err.name === "ValidationError")
		message = Object.values(err.errors).map(val => val.message)

	error = new ErrorResponse(message, 400)

	res.status(error.statusCode || 500).json({
		success: false,
		errors: error.message.split(",").join(", ") || "Server error",
	})
}

module.exports = errorHandler
