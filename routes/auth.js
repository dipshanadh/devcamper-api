const express = require("express")

const { register, login, getCurrentUser } = require("../controllers/auth")
const { protect } = require("../middleware/auth")

const router = express.Router()

router
	.post("/register", register)
	.post("/login", login)
	.get("/profile", protect, getCurrentUser)

module.exports = router
