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

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body

	// Validate email & password
	if (!email || !password) {
		return next(
			new ErrorResponse("Please provide an email and password", 400)
		)
	}

	// Get the user
	const user = await User.findOne({ email }).select("+password")

	// Check for user
	if (!user)
		return next(
			new ErrorResponse("No user found with the entered email", 401)
		)

	// Check is password matches
	const isMatch = await user.matchPassword(password)

	if (!isMatch)
		return next(
			new ErrorResponse("No user found with the entered password", 401)
		)

	// Create token
	const token = user.getSignedJwtToken()

	res.status(200).json({
		success: true,
		token,
	})
})

// @desc    Get current logged in user
// @route   POST /api/auth/user
// @access  Private
const getCurrentUser = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({ slug: req.user.slug })

	res.status(200).json({
		success: true,
		data: user,
	})
})

module.exports = { register, login, getCurrentUser }
