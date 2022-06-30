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
	.post(addCourse)

router.route("/:slug").get(getCourse).put(updateCourse).delete(deleteCourse)

module.exports = router
