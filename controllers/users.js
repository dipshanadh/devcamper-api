// import the model
const User = require("../models/User")

const asyncHandler = require("../middleware/asyncHandler")

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults)
})

// @desc    Get a user
// @route   GET /api/users/:slug
// @access  Public
const getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({ slug: req.params.slug })

	res.status(200).json({
		sucess: true,
		data: user,
	})
})

// @desc    Register a user
// @route   POST /api/users
// @access  Private/Admin
const createUser = asyncHandler(async (req, res, next) => {
	const user = await User.create(req.body)

	res.status(201).json({
		success: true,
		data: user,
	})
})

// @desc    Update a user
// @route   PUT /api/users/:slug
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res, next) => {
	const user = await User.findOneAndUpdate(
		{ slug: req.params.slug },
		req.body,
		{
			new: true,
			runValidators: true,
		}
	)

	res.status(200).json({
		success: true,
		data: user,
	})
})

// @desc    Update a user
// @route   DELETE /api/users/:slug
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res, next) => {
	await User.findOneAndDelete({ slug: req.params.slug })

	res.status(200).json({
		success: true,
		data: {},
	})
})

module.exports = {
	getUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser,
}
