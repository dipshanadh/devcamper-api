const express = require("express")

const {
	register,
	login,
	getCurrentUser,
	forgotPassword,
	updatePassword,
	resetPassword,
	updateUserDetails,
} = require("../controllers/auth")

const { protect } = require("../middleware/auth")

const router = express.Router()

router
	.post("/register", register)
	.post("/login", login)
	.get("/profile", protect, getCurrentUser)
	.put("/update-details", protect, updateUserDetails)
	.post("/forgot-password", forgotPassword)
	.put("/update-password/", protect, updatePassword)
	.put("/resetPassword/:resetToken", resetPassword)

module.exports = router
