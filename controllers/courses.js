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
	if (req.params.bootcampSlug) {
		const courses = await Course.find({
			bootcampSlug: req.params.bootcampSlug,
		})

		res.status(200).json({
			success: true,
			count: courses.length,
			data: courses,
		})
	} else {
		res.status(200).json(res.advancedResults)
	}
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
	req.body.user = req.user.id
	req.body.userSlug = req.user.slug

	const bootcamp = await Bootcamp.findOne({ slug: req.params.bootcampSlug })

	if (!bootcamp)
		next(
			new ErrorResponse(
				`No bootcamp with the id of ${req.params.bootcampSlug}`,
				404
			)
		)

	req.body.bootcamp = bootcamp._id

	// Make sure user is bootcamp owner
	if (bootcamp.userSlug !== req.user.slug && req.user.role !== "admin")
		return next(
			new ErrorResponse(
				`User ${req.user.slug} is not authorized to add a course to bootcamp ${bootcamp.slug}`
			)
		)

	const course = await Course.create(req.body)

	res.status(200).json({
		success: true,
		data: course,
	})
})

// @desc    Update a course
// @route   GET /api/courses/:slug/
// @access  Private
const updateCourse = asyncHandler(async (req, res, next) => {
	let course = await Course.findOne({ slug: req.params.slug })

	if (!course)
		next(
			new ErrorResponse(
				`No course with the id of ${req.params.slug}`,
				404
			)
		)

	// Make sure user is course owner
	if (course.userSlug !== req.user.slug && req.user.role !== "admin")
		return next(
			new ErrorResponse(
				`User ${req.user.slug} is not authorized to update course ${course.slug}`
			)
		)

	course = await Course.findOneAndUpdate(
		{ slug: req.params.slug },
		req.body,
		{
			new: true,
			runValidators: true,
		}
	)

	res.status(200).json({
		success: true,
		data: course,
	})
})

// @desc    Delete a course
// @route   DELETE /api/courses/:slug/
// @access  Private
const deleteCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findOne({ slug: req.params.slug })

	if (!course)
		next(
			new ErrorResponse(
				`No bootcamp with the id of ${req.params.slug}`,
				404
			)
		)

	// Make sure user is course owner
	if (course.userSlug !== req.user.slug && req.user.role !== "admin")
		return next(
			new ErrorResponse(
				`User ${req.user.slug} is not authorized to delete course ${course.slug}`
			)
		)

	await course.remove()

	res.status(200).json({
		success: true,
		data: {},
	})
})

module.exports = {
	getCourses,
	getCourse,
	addCourse,
	updateCourse,
	deleteCourse,
}
