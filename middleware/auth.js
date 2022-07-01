const jwt = require("jsonwebtoken")
const asyncHandler = require("./asyncHandler")
const ErrorResponse = require("../utils/errorResponse")
const User = require("../models/User")

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
	let token

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1]
	}

	// Mke sure token exists
	if (!token) {
		return next(
			new ErrorResponse("Not authorize to access this route", 401)
		)
	}

	try {
		// Verify token
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

		// console.log(decodedToken)

		req.user = await User.findOne({ slug: decodedToken.slug })
		next()
	} catch (err) {
		console.log(err)
	}
})

const authorize =
	(...roles) =>
	(req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorResponse(
					`User role ${req.user.role} is not authorized to access this route`,
					403
				)
			)
		}

		next()
	}

module.exports = {
	protect,
	authorize,
}
