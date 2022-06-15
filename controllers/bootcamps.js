// import the schema
const Bootcamp = require("../models/Bootcamp")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/asyncHandler")

// @desc    Get all bootcamps
// @route   GET /api/bootcamps
// @access  Public

// using async handler to prevent repetitive code
const getBootcamps = asyncHandler(async (req, res, next) => {
	const bootcamps = await Bootcamp.find()

	res.status(200).json({
		success: true,
		count: bootcamps.length,
		data: bootcamps,
	})
})

// @desc    Get a single bootcamp
// @route   GET /api/bootcamps/:id
// @access  Public
const getBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findOne({ slug: req.params.slug })

	// this is for well formatted object id, but not found on database
	if (bootcamp) {
		res.status(200).json({ sucess: true, data: bootcamp })
	} else {
		next(
			new ErrorResponse(
				`Bootcamp not found with id of ${req.params.id}`,
				404
			)
		)
	}
})

// @desc    Create a new bootcamp
// @route   POST /api/bootcamps
// @access  Private
const createBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.create(req.body)

	res.status(201).json({
		success: true,
		data: bootcamp,
	})
})

// @desc    Update a bootcamp
// @route   PUT /api/bootcamps/:id
// @access  Private
const updateBootcamp = asyncHandler(async (req, res, next) => {
	// passing three parameters to the findByIdAndUpdate function, one the id, second the updted data and third (optional) for more configuration
	const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
		// to get the updated data as response
		new: true,
		runValidators: true,
	})

	if (bootcamp) {
		res.status(200).json({
			success: true,
			data: bootcamp,
		})
	} else {
		next(
			new ErrorResponse(
				`Bootcamp not found with id of ${req.params.id}`,
				404
			)
		)
	}
})

// @desc    Delete a bootcamp
// @route   DELETE /api/bootcamps/:id
// @access  Private
const deleteBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

	if (bootcamp) {
		const Bootcamps = await Bootcamp.find()
		res.status(200).json({
			success: true,
			data: Bootcamps,
		})
	} else {
		next(
			new ErrorResponse(
				`Bootcamp not found with id of ${req.params.id}`,
				404
			)
		)
	}
})

module.exports = {
	getBootcamp,
	getBootcamps,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
}
