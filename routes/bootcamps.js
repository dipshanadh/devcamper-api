const express = require("express")
const fileupload = require("express-fileupload")

// controller functions
const {
	getBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	bootcampPhotoUpload,
	getBootcampsInRadius,
} = require("../controllers/bootcamps")

const Bootcamp = require("../models/Bootcamp")
const advancedResults = require("../middleware/advancedResults")

// Include other resource routers
const courseRouter = require("./courses")
const reviewRouter = require("./reviews")

const router = express.Router()

const { protect, authorize } = require("../middleware/auth")

// Re-route into other resource router
router.use("/:bootcampSlug/courses", courseRouter)
router.use("/:bootcampSlug/reviews", reviewRouter)

// "Get bootcamp in radius" route
router.route("/radius/:zipcode/:distance").get(
	advancedResults(Bootcamp, {
		path: "courses",
		select: "title slug",
	}),
	getBootcampsInRadius
)

// File uploading
router.use(fileupload())

// Photo upload route
router
	.route("/:slug/photo")
	.put(protect, authorize("publisher", "admin"), bootcampPhotoUpload)

// Bootcamp routes
router
	.route("/")
	.get(
		advancedResults(Bootcamp, {
			path: "courses",
			select: "title slug",
		}),
		getBootcamps
	)
	.post(protect, authorize("publisher", "admin"), createBootcamp)

router
	.route("/:slug")
	.get(getBootcamp)
	.delete(protect, authorize("publisher", "admin"), deleteBootcamp)
	.put(protect, authorize("publisher", "admin"), updateBootcamp)

module.exports = router
