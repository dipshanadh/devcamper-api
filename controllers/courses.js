// import the schema
const Course = require("../models/Course")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/asyncHandler")

// @desc    Get all courses
// @route   GET /api/courses
// @route   GET /api/bootcamps/:bootcamp/courses
// @access  Public
const getCourses = asyncHandler(async (req, res, next) => {
	// defining query
	let query

	if (req.params.bootcamp) {
		query = Course.find({
			bootcamp: req.params.bootcamp,
		})
	} else {
		query = Course.find()
	}

	// executing query
	const courses = await query

	if (!(courses.length > 0) && req.params.bootcamp) {
		next(
			new ErrorResponse(
				`Bootcamp not found with id of ${req.params.bootcamp}`,
				404
			)
		)
	} else {
		res.status(200).json({
			success: true,
			count: courses.length,
			data: courses,
		})
	}
})

module.exports = { getCourses }
