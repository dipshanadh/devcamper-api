// @desc    Get all bootcamps
// @route   GET /api/bootcamps
// @access  Public
const getBootcamps = (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: "Show all bootcamps",
	})
}

// @desc    Get a single bootcamp
// @route   GET /api/bootcamps/:id
// @access  Public
const getBootcamp = (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: `Display bootcamp ${req.params.id}`,
	})
}

// @desc    Create a new bootcamp
// @route   POST /api/bootcamps
// @access  Private
const createBootcamp = (req, res, next) => {
	res.status(200).json({ success: true, msg: "Create new bootcamp" })
}

// @desc    Update a bootcamp
// @route   PUT /api/bootcamps/:id
// @access  Private
const updateBootcamp = (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: `Update bootcamp ${req.params.id}`,
	})
}

// @desc    Delete a bootcamp
// @route   DELETE /api/bootcamps/:id
// @access  Private
const deleteBootcamp = (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: `Delete bootcamp ${req.params.id}`,
	})
}

module.exports = {
	getBootcamp,
	getBootcamps,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
}
