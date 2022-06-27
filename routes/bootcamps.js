const express = require("express")

// controller functions
const {
	getBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	bootcampPhotoUpload,
} = require("../controllers/bootcamps")

// Include other resource routers
const courseRouter = require("./courses")

const router = express.Router()

// Re-route into other resource router
router.use("/:bootcampSlug/courses", courseRouter)

// Photo upload route
router.route("/:slug/photo").put(bootcampPhotoUpload)

// mount the routes
router.route("/").get(getBootcamps).post(createBootcamp)

router
	.route("/:slug")
	.get(getBootcamp)
	.delete(deleteBootcamp)
	.put(updateBootcamp)

module.exports = router
