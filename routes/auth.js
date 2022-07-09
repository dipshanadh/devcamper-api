const express = require("express")

const {
	register,
	login,
	getCurrentUser,
	forgotPassword,
	resetPassword,
} = require("../controllers/auth")

const { protect } = require("../middleware/auth")

const router = express.Router()

router
	.post("/register", register)
	.post("/login", login)
	.get("/profile", protect, getCurrentUser)
	.post("/forgot-password", forgotPassword)
	.put("/resetPassword/:resetToken", resetPassword)

module.exports = router
