// import the schema
const User = require("../models/User")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/asyncHandler")

// @desc    Register a user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res, next) => {
	const { name, email, password, role } = req.body

	// Create user
	const user = await User.create({
		name,
		email,
		password,
		role,
	})

	// Create token
	const token = user.getSignedJwtToken()

	res.status(200).json({
		success: true,
		token,
	})
})

module.exports = { register }
