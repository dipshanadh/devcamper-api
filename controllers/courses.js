// import the schema
const Course = require("../models/Course")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/asyncHandler")

// @desc    Get all courses
// @route   GET /api/courses
// @route   GET /api/bootcamps/:bootcampSlug/courses
// @access  Public
const getCourses = asyncHandler(async (req, res, next) => {
	// defining query
	let query

	if (req.params.bootcampSlug) {
		query = Course.find({ bootcampSlug: req.params.bootcampSlug }).populate(
			{
				path: "bootcamp",
				select: "name",
			}
		)
	} else {
		query = Course.find().populate({
			path: "bootcamp",
			select: "name description",
		})
	}

	// executing query
	const courses = await query

	res.status(200).json({
		success: true,
		count: courses.length,
		data: courses,
	})
})

module.exports = { getCourses }
