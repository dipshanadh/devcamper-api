const express = require("express")

// controller functions
const { getReviews, getReview, addReview } = require("../controllers/reviews")

const Review = require("../models/Review")
const advancedResults = require("../middleware/advancedResults")

const router = express.Router({ mergeParams: true })

const { protect, authorize } = require("../middleware/auth")

// mount the routes
router
	.route("/")
	.get(
		advancedResults(Review, {
			path: "bootcamp",
			select: "title slug",
		}),
		getReviews
	)
	.post(protect, authorize("user", "admin"), addReview)

router.route("/:id").get(getReview)

module.exports = router
