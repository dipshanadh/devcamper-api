const crypto = require("crypto")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const slugify = require("slugify")
const jwt = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please add a name"],
	},
	email: {
		type: String,
		required: [true, "Please add an email"],
		unique: true,
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		],
	},
	role: {
		type: String,
		enum: ["user", "publisher"],
		default: "user",
	},
	password: {
		type: String,
		require: [true, "Please add a password"],
		minlength: 6,
		// select: false won't return the password while finding the document
		select: false,
	},
	slug: String,
	resetPasswordToken: String,
	resetPasswordExpire: Date,
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) next()

	// encrypting password
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)

	// creating slug
	this.slug = slugify(this.name, {
		lower: true,
		strict: true,
	})

	next()
})

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
	return jwt.sign({ slug: this.slug }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	})
}

// Match password entered by user to hashed password
UserSchema.methods.matchPassword = async function (enteredPwd) {
	return await bcrypt.compare(enteredPwd, this.password)
}

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
	// Generate token
	const resetToken = crypto.randomBytes(20).toString("hex")

	// Hash token and set to resetPasswordToken field
	this.resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex")

	// Set expire
	this.resetPasswordExpire = Date.now() + 1000 * 60 * 5

	return resetToken
}

module.exports = mongoose.model("User", UserSchema)
