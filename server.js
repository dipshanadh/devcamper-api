// importing all dependencies
const express = require("express")
const dotenv = require("dotenv")
const mongoSanitize = require("express-mongo-sanitize")
const helmet = require("helmet")
const xss = require("xss-clean")
const rateLimit = require("express-rate-limit")
const hpp = require("hpp")

const connectDB = require("./config/db")

// Load env vars with a custom path using the config function
dotenv.config({ path: "./config/config.env" })

// connect to database
connectDB()

// middleware files
const logger = require("./middleware/logger")
const errorHandler = require("./middleware/errorHandler")

// router files
const bootcamps = require("./routes/bootcamps")
const courses = require("./routes/courses")
const auth = require("./routes/auth")
const users = require("./routes/users")
const reviews = require("./routes/reviews")

// initializing the app
const app = express()

// Body parser for json
app.use(express.json())

// logger middleware
app.use(logger)

// set security headers
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
	windowMs: 10 * 60 * 60 * 1000, // 10mins
	max: 100,
})

app.use(limiter)

// Prevent http param pollution
app.use(hpp())

// Set static folder
app.use(express.static("public"))

// Sanitize data
app.use(mongoSanitize())

// Prevent cross site scripting (XSS)
app.use(xss())

// mount routers
app.use("/api/bootcamps", bootcamps)
app.use("/api/courses", courses)
app.use("/api/auth", auth)
app.use("/api/users", users)
app.use("/api/reviews", reviews)

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
