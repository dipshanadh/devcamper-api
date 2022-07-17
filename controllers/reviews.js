// import the schema
const Review = require("../models/Review")
const Bootcamp = require("../models/Bootcamp")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/asyncHandler")

// @desc    Get reviews
// @route   GET /api/reviews
// @route   GET /api/bootcamps/:bootcampSlug/reviews
// @access  Public
const getReviews = asyncHandler(async (req, res, next) => {
	if (req.params.bootcampSlug) {
		const bootcamp = await Bootcamp.findOne({
			slug: req.params.bootcampSlug,
		})

		if (!bootcamp)
			return next(
				new ErrorResponse(
					`No bootcamp found with the id of ${req.params.bootcampSlug}`
				)
			)

		const reviews = await Review.find({
			bootcampSlug: req.params.bootcampSlug,
		})

		res.status(200).json({
			success: true,
			count: reviews.length,
			data: reviews,
		})
	} else {
		res.status(200).json(res.advancedResults)
	}
})

// @desc    Get a single review
// @route   GET /api/reviews/:id
// @access  Public
const getReview = asyncHandler(async (req, res, next) => {
	const review = await Review.findById(req.params.id).populate({
		path: "bootcamp",
		select: "title slug",
	})

	if (!review)
		return next(
			new ErrorResponse(
				`No review found with the id of ${req.params.id}`,
				404
			)
		)

	res.status(200).json({
		success: true,
		data: review,
	})
})

// @desc    Add a review
// @route   POST /api/bootcamps/:bootcampSlug/reviews
// @access  Private
const addReview = asyncHandler(async (req, res, next) => {
	req.body.bootcampSlug = req.params.bootcampSlug
	req.body.user = req.user.id

	const bootcamp = await Bootcamp.findOne({ slug: req.params.bootcampSlug })

	if (!bootcamp)
		return next(
			new ErrorResponse(
				`No bootcamp found with the id of ${req.params.id}`,
				404
			)
		)

	req.body.bootcamp = bootcamp.id

	// Prevent user from submitting more than one review for a bootcamp
	let review = await Review.find({ user: req.user.id })

	if (review)
		return next(
			new ErrorResponse(
				"A review has already been submitted by the user",
				401
			)
		)

	review = await Review.create(req.body)

	res.status(200).json({
		success: true,
		data: review,
	})
})

module.exports = { getReviews, getReview, addReview }
