const mongoose = require("mongoose")

const ReviewSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		maxlength: [50, "Title can not be more than 50 characters"],
		required: [true, "Please add a review title"],
	},
	text: {
		type: String,
		maxlength: [500, "Review text can not be more than 500 characters"],
		required: [true, "Please add a review text"],
	},
	rating: {
		type: Number,
		required: [true, "Please add the rating between 1 to 10"],
		min: 1,
		max: 10,
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
	user: {
		type: mongoose.Schema.ObjectId,
		// reference for User model
		ref: "User",
		required: true,
	},
	userSlug: {
		type: String,
	},
	slug: String,
})

// Static method to get avg rating of bootcamps and save
ReviewSchema.statics.getAverageRating = async function (id) {
	const obj = await this.aggregate([
		{
			$match: { bootcamp: id },
		},
		{
			// the id must be specified
			$group: {
				_id: "$bootcamp",
				averageRating: { $avg: "$rating" },
			},
		},
	])

	await this.model("Bootcamp").findByIdAndUpdate(id, {
		averageRating: Math.ceil(obj[0].averageRating),
	})
}

// Call getAverageCost after save
ReviewSchema.post("save", function () {
	this.constructor.getAverageRating(this.bootcamp)
})

// Call getAverageRating after remove
ReviewSchema.post("remove", function () {
	this.constructor.getAverageRating(this.bootcamp)
})

module.exports = mongoose.model("Review", ReviewSchema)
