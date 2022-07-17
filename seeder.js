const mongoose = require("mongoose")
const dotenv = require("dotenv")
const fs = require("fs")
const path = require("path")

// Load env vars
dotenv.config({ path: "./config/config.env" })

// Load models
const Bootcamp = require("./models/Bootcamp")
const Course = require("./models/Course")
const User = require("./models/User")
const Review = require("./models/Review")

// Connect to DB
mongoose.connect(process.env.MONGO_URI)

// Read JSON files
const bootcamps = JSON.parse(
	fs.readFileSync(path.join(__dirname, "/_data/bootcamps.json"), "utf-8")
)
const courses = JSON.parse(
	fs.readFileSync(path.join(__dirname, "/_data/courses.json"), "utf-8")
)
const users = JSON.parse(
	fs.readFileSync(path.join(__dirname, "/_data/users.json"), "utf-8")
)
const reviews = JSON.parse(
	fs.readFileSync(path.join(__dirname, "/_data/reviews.json"), "utf-8")
)

// Import into DB
const importData = async () => {
	try {
		await User.create(users)
		await Bootcamp.create(bootcamps)
		await Course.create(courses)
		await Review.create(reviews)

		console.log("Data Imported....")
		process.exit()
	} catch (err) {
		console.log(err.message)
		process.exit()
	}
}

// Delete data
const deleteData = async () => {
	try {
		await User.deleteMany()
		await Bootcamp.deleteMany()
		await Course.deleteMany()
		await Review.deleteMany()

		console.log("Data Destroyed....")
		process.exit()
	} catch (err) {
		console.log(err.message)
		process.exit()
	}
}

if (process.argv[2] === "-i") importData()
else if (process.argv[2] === "-d") deleteData()
