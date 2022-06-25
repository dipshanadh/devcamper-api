const mongoose = require("mongoose")
const slugify = require("slugify")

const geocoder = require("../utils/geocoder")

const BootcampSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			// for a custom message we can put an array with two values, one the boolean and the next one message
			required: [true, "Please add a name"],
			unique: true,
			trim: true,
			maxlength: [50, "Name can not be more than 50 characters"],
		},
		slug: String,
		description: {
			type: String,
			required: [true, "Please add a description"],
			maxlength: [500, "Description can not be more than 500 characters"],
		},
		website: {
			type: String,
			match: [
				/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
				"Please enter a valid URL with HTTP or HTTPS",
			],
		},
		phone: {
			type: String,
			maxlength: [
				20,
				"Phone number can not be longer than 20 characters",
			],
		},
		email: {
			type: String,
			match: [
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			],
		},
		address: {
			type: String,
			required: [true, "Please add an address"],
		},
		location: {
			// GeoJSON point
			type: {
				type: String,
				enum: ["Point"],
			},
			coordinates: {
				type: [Number],
				index: "2dsphere",
			},
			formattedAddress: String,
			street: String,
			city: String,
			state: String,
			zipcode: String,
			country: String,
		},
		careers: {
			// Array of strings
			type: [String],
			required: true,
			enum: [
				"Web Development",
				"Mobile Development",
				"UI/UX",
				"Data Science",
				"Business",
				"Other",
			],
		},
		averageRating: {
			type: Number,
			min: [1, "Rating must be atleast 1"],
			max: [10, "Rating can not be more than 10"],
		},
		averageCourseCost: Number,
		photo: {
			type: String,
			default: "no-photo.jpg",
		},
		housing: { type: Boolean, default: false },
		jobAssistance: {
			type: Boolean,
			default: false,
		},
		jobGuarantee: {
			type: Boolean,
			default: false,
		},
		acceptGi: {
			type: Boolean,
			default: false,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
)

// Create bootcamp slug from the name
BootcampSchema.pre("save", function (next) {
	this.slug = slugify(this.name, {
		lower: true,
		strict: true,
	})

	next()
})

// Geocode and create location field
BootcampSchema.pre("save", async function (next) {
	const loc = await geocoder.geocode(this.address)

	this.location = {
		type: "Point",
		coordinates: [loc[0].longitude, loc[0].latitude],
		formattedAddress: loc[0].formattedAddress,
		street: loc[0].streetName,
		city: loc[0].city,
		state: loc[0].stateCode,
		country: loc[0].countryCode,
		zipcode: loc[0].zipcode,
	}

	// Do not save address in DB
	// this.address = undefined

	next()
})

// Cascade delete coures when a bootcamp is deleted
BootcampSchema.pre("remove", async function (next) {
	await this.model("Course").deleteMany({ bootcamp: this._id })

	console.log(`Courses being removed from bootcamp ${this.slug}`)

	next()
})

// Reverse populate with virtuals
BootcampSchema.virtual("courses", {
	ref: "Course",
	localField: "_id",
	foreignField: "bootcamp",
	justOne: false,
})

module.exports = mongoose.model("Bootcamp", BootcampSchema)
