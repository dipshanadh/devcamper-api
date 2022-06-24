// import the schema
const Course = require("../models/Course")
const Bootcamp = require("../models/Bootcamp")
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
			select: "name",
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

// @desc    Get a single course
// @route   GET /api/courses/:slug
// @access  Public
const getCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findOne({ slug: req.params.slug }).populate({
		path: "bootcamp",
		select: "name",
	})

	if (course) {
		res.status(200).json({
			success: true,
			data: course,
		})
	} else {
		next(
			new ErrorResponse(
				`No course with the id of ${req.params.slug}`,
				404
			)
		)
	}
})

// @desc    Add a course
// @route   GET /api/courses/:bootcampSlug/courses
// @access  Private
const addCourse = asyncHandler(async (req, res, next) => {
	req.body.bootcampSlug = req.params.bootcampSlug

	const bootcamp = await Bootcamp.findOne({ slug: req.params.bootcampSlug })
	req.body.bootcamp = bootcamp._id

	if (bootcamp) {
		const course = await Course.create(req.body)

		res.status(200).json({
			success: true,
			data: course,
		})
	} else {
		next(
			new ErrorResponse(
				`No bootcamp with the id of ${req.params.bootcampSlug}`,
				404
			)
		)
	}
})

module.exports = { getCourses, getCourse, addCourse }
