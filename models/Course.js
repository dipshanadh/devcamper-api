const mongoose = require("mongoose")

const CourseSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: [true, "Please add a course title"],
	},
	description: {
		type: String,
		required: [true, "Please add a description"],
	},
	weeks: {
		type: Number,
		require: [true, "Please add number of weeks"],
	},
	tuition: {
		type: Number,
		required: [true, "Please add a tuition cost"],
	},
	minimunSkill: {
		type: Strinbng,
		required: [true, "Pleaes add a minimum skill"],
		enum: ["beginner", "intermediate", "advanced"],
	},
	scholarshipAvailable: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	bootcamp: {
		type: mongoose.Schema.ObjectId,
		// reference for boocamp model
		ref: "Bootcamp",
		require: true,
	},
})

module.exports = mongoose.model("Course", CourseSchema)
