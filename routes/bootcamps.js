const express = require("express")

// controller functions
const {
	getBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
} = require("../controllers/bootcamps")

const router = express.Router()

// mount the routes
router.route("/").get(getBootcamps).post(createBootcamp)

router
	.route("/:slug")
	.get(getBootcamp)
	.delete(deleteBootcamp)
	.put(updateBootcamp)

module.exports = router
