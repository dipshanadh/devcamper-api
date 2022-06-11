// importing all dependencies
const express = require("express")
const dotenv = require("dotenv")
const connectDB = require("./config/db")

// Load env vars
dotenv.config({ path: "./config/config.env" })

// connect to database
connectDB()

// middleware files
const logger = require("./middleware/logger")

// router files
const bootcamps = require("./routes/bootcamps")

// initializing the app
const app = express()

// logger middleware
app.use(logger)

// mount routers
app.use("/api/bootcamps", bootcamps)

const PORT = process.env.PORT

// listening to the app
const server = app.listen(
	PORT,
	console.log(
		`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
	)
)

// Handle unhandles promise rejections
process.on("unhandledRejection", err => {
	// log the error
	console.log(`Error: ${err.message}`)

	// close the server and exit process
	server.close(() => process.exit(1))
})
