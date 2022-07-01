const express = require("express")

// controller functions
const {
	getCourses,
	getCourse,
	addCourse,
	updateCourse,
	deleteCourse,
} = require("../controllers/courses")

const Course = require("../models/Course")
const advancedResults = require("../middleware/advancedResults")

const router = express.Router({ mergeParams: true })

const { protect, authorize } = require("../middleware/auth")

// mount the routes
router
	.route("/")
	.get(
		advancedResults(Course, {
			path: "bootcamp",
			select: "title",
		}),
		getCourses
	)
	.post(protect, authorize("publisher", "admin"), addCourse)

router
	.route("/:slug")
	.get(getCourse)
	.put(protect, authorize("publisher", "admin"), updateCourse)
	.delete(protect, authorize("publisher", "admin"), deleteCourse)

module.exports = router
