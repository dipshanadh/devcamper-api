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

const router = express.Router()

// Re-route into other resource router
router.use("/:bootcampSlug/courses", courseRouter)

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
router.route("/:slug/photo").put(bootcampPhotoUpload)

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
	.post(createBootcamp)

router
	.route("/:slug")
	.get(getBootcamp)
	.delete(deleteBootcamp)
	.put(updateBootcamp)

module.exports = router
