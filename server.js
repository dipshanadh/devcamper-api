// importing all dependencies
const express = require("express")
const dotenv = require("dotenv")

// middlewares
const logger = require("./middleware/logger")

// router files
const bootcamps = require("./routes/bootcamps")

// Load env vars
dotenv.config({ path: "./config/config.env" })

const app = express()

// logger middleware
app.use(logger)

// mount routers
app.use("/api/bootcamps", bootcamps)

const PORT = process.env.PORT

// listening
app.listen(
	PORT,
	console.log(
		`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
	)
)
