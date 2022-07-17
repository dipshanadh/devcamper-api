const express = require("express")

// controller functions
const {
	getReviews,
	// getCourse,
	// addCourse,
	// updateCourse,
	// deleteCourse,
} = require("../controllers/reviews")

const Review = require("../models/Review")
const advancedResults = require("../middleware/advancedResults")

const router = express.Router({ mergeParams: true })

const { protect, authorize } = require("../middleware/auth")

// mount the routes
router.route("/").get(
	advancedResults(Review, {
		path: "bootcamp",
		select: "title",
	}),
	getReviews
)

module.exports = router
