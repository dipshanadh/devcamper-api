const express = require("express")

const {
	getUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser,
} = require("../controllers/users")

const User = require("../models/User")

const router = express.Router()

// middlewares
const advancedResults = require("../middleware/advancedResults")
const { protect, authorize } = require("../middleware/auth")

router
	.route("/")
	.get(advancedResults(User), getUsers)
	.post(protect, authorize("admin"), createUser)

router
	.route("/:slug")
	.get(getUser)
	.put(protect, authorize("admin"), updateUser)
	.delete(protect, authorize("admin"), deleteUser)

module.exports = router
