// importing all dependencies
const express = require("express")
const dotenv = require("dotenv")

// Load env vars
dotenv.config({ path: "./config/config.env" })

const app = express()

// app.get("/", (req, res) => {
// res.send("<h1>Hello from express</h1>")
// to send a status
// res.sendStatus()
// to send status with some data
// res.status(400).json({ success: false })
// })

app.get("/api/bootcamps", (req, res) => {
	res.status(200).json({ success: true, msg: "Show all bootcamps" })
})

app.get("/api/bootcamps/:id", (req, res) => {
	res.status(200).json({
		success: true,
		msg: `Display bootcamp ${req.params.id}`,
	})
})

app.post("/api/bootcamps", (req, res) => {
	res.status(200).json({ success: true, msg: "Create new bootcamp" })
})

app.put("/api/bootcamps/:id", (req, res) => {
	res.status(200).json({
		success: true,
		msg: `Update bootcamp ${req.params.id}`,
	})
})

app.delete("/api/bootcamps/:id", (req, res) => {
	res.status(200).json({
		success: true,
		msg: `Delete bootcamp ${req.params.id}`,
	})
})

const PORT = process.env.PORT

// listening
app.listen(
	PORT,
	console.log(
		`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
	)
)
