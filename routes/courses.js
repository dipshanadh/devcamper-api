const express = require("express")

// controller functions
const { getCourses, getCourse, addCourse } = require("../controllers/courses")

const router = express.Router({ mergeParams: true })

// mount the routes
router.route("/").get(getCourses).post(addCourse)

router.route("/:slug").get(getCourse)

module.exports = router
