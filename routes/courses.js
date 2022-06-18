const express = require("express")

// controller functions
const { getCourses } = require("../controllers/courses")

const router = express.Router({ mergeParams: true })

// mount the routes
router.route("/").get(getCourses)

module.exports = router
