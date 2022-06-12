// import the schema
const Bootcamp = require("../models/Bootcamp")

const ErrorResponse = require("../utils/errorResponse")

// @desc    Get all bootcamps
// @route   GET /api/bootcamps
// @access  Public
const getBootcamps = async (req, res, next) => {
	try {
		const bootcamps = await Bootcamp.find()

		res.status(200).json({
			success: true,
			data: bootcamps,
		})
	} catch (err) {
		next(err)
	}
}

// @desc    Get a single bootcamp
// @route   GET /api/bootcamps/:id
// @access  Public
const getBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findById(req.params.id)

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
	} catch (err) {
		// this is for not well formatted object id
		next(err)
	}
}

// @desc    Create a new bootcamp
// @route   POST /api/bootcamps
// @access  Private
const createBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.create(req.body)

		res.status(201).json({
			success: true,
			data: bootcamp,
		})
	} catch (err) {
		next(err)
	}
}

// @desc    Update a bootcamp
// @route   PUT /api/bootcamps/:id
// @access  Private
const updateBootcamp = async (req, res, next) => {
	try {
		// passing three parameters to the findByIdAndUpdate function, one the id, second the updted data and third (optional) for more configuration
		const bootcamp = await Bootcamp.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				// to get the updated data as response
				new: true,
				runValidators: true,
			}
		)

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
	} catch (err) {
		next(err)
	}
}

// @desc    Delete a bootcamp
// @route   DELETE /api/bootcamps/:id
// @access  Private
const deleteBootcamp = async (req, res, next) => {
	try {
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
	} catch (err) {
		next(err)
	}
}

module.exports = {
	getBootcamp,
	getBootcamps,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
}
