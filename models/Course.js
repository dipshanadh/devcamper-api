const mongoose = require("mongoose")
const slugify = require("slugify")

const CourseSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		maxlength: [50, "Title can not be more than 50 characters"],
		required: [true, "Please add a course title"],
		unique: true,
	},
	description: {
		type: String,
		maxlength: [500, "Description can not be more than 500 characters"],
		required: [true, "Please add a description"],
	},
	weeks: {
		type: Number,
		required: [true, "Please add number of weeks"],
	},
	tuition: {
		type: Number,
		required: [true, "Please add a tuition cost"],
	},
	minimumSkill: {
		type: String,
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
		required: true,
	},
	bootcampSlug: {
		type: String,
		required: true,
	},
	slug: String,
})

// Create course slug from the name
CourseSchema.pre("save", function (next) {
	this.slug = slugify(this.title, {
		lower: true,
		strict: true,
	})

	next()
})

module.exports = mongoose.model("Course", CourseSchema)
