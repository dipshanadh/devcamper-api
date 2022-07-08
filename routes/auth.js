const express = require("express")

const {
	register,
	login,
	getCurrentUser,
	forgotPassword,
} = require("../controllers/auth")

const { protect } = require("../middleware/auth")

const router = express.Router()

router
	.post("/register", register)
	.post("/login", login)
	.get("/profile", protect, getCurrentUser)
	.post("/forgot-password", forgotPassword)

module.exports = router
