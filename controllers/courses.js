// import the schema
const Course = require("../models/Course")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/asyncHandler")

// @desc    Get all courses
// @route   GET /api/courses
// @route   GET /api/bootcamps/:bootcampSlug/courses
// @access  Public
const getCourses = asyncHandler(async (req, res, next) => {
	const { bootcampSlug } = req.params

	if (req.params.bootcampSlug) {
		const courses = Course.find({
			bootcampSlug,
		})
	} else {
		const courses = Course.find()
	}

	if (courses.length > 0) {
		res.status(200).json({
			success: true,
			count: courses.length,
			data: courses,
		})
	} else {
		next(
			new ErrorResponse(
				`Bootcamp not found with id of ${bootcampSlug}`,
				404
			)
		)
	}
})

module.exports = { getCourses }
