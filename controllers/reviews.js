// import the schema
const Review = require("../models/Review")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/asyncHandler")

// @desc    Get reviews
// @route   GET /api/reviews
// @route   GET /api/bootcamps/:bootcampSlug/courses
// @access  Public
const getReviews = asyncHandler(async (req, res, next) => {
	if (req.params.bootcampSlug) {
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

module.exports = { getReviews }
