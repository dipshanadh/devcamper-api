// importing all dependencies
const express = require("express")
const fileupload = require("express-fileupload")
const connectDB = require("./config/db")

// connect to database
connectDB()

// middleware files
const logger = require("./middleware/logger")
const errorHandler = require("./middleware/errorHandler")

// router files
const bootcamps = require("./routes/bootcamps")
const courses = require("./routes/courses")

// initializing the app
const app = express()

// Body parser for json
app.use(express.json())

// logger middleware
app.use(logger)

// File uploading
app.use(fileupload())

// mount routers
app.use("/api/bootcamps", bootcamps)
app.use("/api/courses", courses)

// error handler - put after the router !
app.use(errorHandler)

const PORT = process.env.PORT

// listening to the app
app.listen(
	PORT,
	// log message after succesfully listening to the app
	console.log(
		`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
	)
)
