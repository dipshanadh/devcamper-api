// import the schema
const User = require("../models/User")
const ErrorResponse = require("../utils/errorResponse")
const sendEmail = require("../utils/sendEmail")
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

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Private
const forgotPassword = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email })

	if (!user)
		return next(
			new ErrorResponse(
				`There is no user with the email ${req.body.email}`
			)
		)

	// Get reset token
	const resetToken = user.getResetPasswordToken()

	await user.save({ validateBeforeSave: false })

	// Create rest URL
	const resetURL = `${req.protocol}://${req.get(
		"host"
	)}/api/resetPassword/${resetToken}`

	const message = `Your are receiving this email because a password reset request was done for your account. Please make a PUT request to \n\n ${resetURL}`

	try {
		await sendEmail({
			email: user.email,
			subject: "Password rest token",
			message,
		})

		res.status(200).json({ success: true, data: "E-mail sent !" })
	} catch (err) {
		console.log(err)
		user.resetPasswordToken = undefined
		user.resetPasswordExpire = undefined

		await user.save({ validateBeforeSave: false })

		return next(new ErrorResponse(`Email couldn't be sent`, 500))
	}
})

module.exports = { register, login, getCurrentUser, forgotPassword }
