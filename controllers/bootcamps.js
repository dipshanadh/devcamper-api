const path = require("path")

// Geocoder function
const geocoder = require("../utils/geocoder")

// import the schema
const Bootcamp = require("../models/Bootcamp")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/asyncHandler")

// @desc    Get all bootcamps
// @route   GET /api/bootcamps
// @access  Public

// using async handler to prevent repetitive code
const getBootcamps = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults)
})

// @desc    Get a single bootcamp
// @route   GET /api/bootcamps/:slug
// @access  Public
const getBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findOne({ slug: req.params.slug }).populate(
		{
			path: "courses",
			select: "title slug tuition bootcampSlug",
		}
	)

	// this is for well formatted object id, but not found on database
	if (bootcamp) {
		res.status(200).json({ success: true, data: bootcamp })
	} else {
		next(
			new ErrorResponse(
				`Bootcamp not found with id of ${req.params.slug}`,
				404
			)
		)
	}
})

// @desc    Create a new bootcamp
// @route   POST /api/bootcamps
// @access  Private
const createBootcamp = asyncHandler(async (req, res, next) => {
	// Add user to req.body
	req.body.user = req.user.id
	req.body.userSlug = req.user.slug

	// Check for the published bootcamps
	const publishedBootcamp = await Bootcamp.findOne({
		userSlug: req.user.slug,
	})

	// If the user is not an admin, they can only add one bootcamnp
	if (publishedBootcamp && req.user.role !== "admin")
		return next(
			new ErrorResponse(
				`The user with ID ${req.user.slug} has already published a boocamp`,
				400
			)
		)

	const bootcamp = await Bootcamp.create(req.body)

	res.status(201).json({
		success: true,
		data: bootcamp,
	})
})

// @desc    Update a bootcamp
// @route   PUT /api/bootcamps/:slug
// @access  Private
const updateBootcamp = asyncHandler(async (req, res, next) => {
	let bootcamp = await Bootcamp.findOne({ slug: req.params.slug })

	if (!bootcamp)
		return next(
			new ErrorResponse(
				`Bootcamp not found with id of ${req.params.id}`,
				404
			)
		)

	// Make sure user is bootcamp owner
	if (bootcamp.userSlug !== req.user.slug && req.user.role !== "admin")
		return next(
			new ErrorResponse(
				`User ${req.user.slug} is not authorized to update this bootcamp`
			)
		)

	// passing three parameters to the findByIdAndUpdate function, one the id, second the updted data and third (optional) for more configuration
	bootcamp = await Bootcamp.findOneAndUpdate(
		{ slug: req.params.slug },
		req.body,
		{
			// to get the updated data as response
			new: true,
			runValidators: true,
		}
	)

	res.status(200).json({
		success: true,
		data: bootcamp,
	})
})

// @desc    Upload photo for a bootcamp
// @route   PUT /api/bootcamps/:slug/photo
// @access  Private
const bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findOne({ slug: req.params.slug })

	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`Bootcamp not found with id of ${req.params.slug}`,
				404
			)
		)
	}

	// Make sure user is bootcamp owner
	if (bootcamp.userSlug !== req.user.slug && req.user.role !== "admin")
		return next(
			new ErrorResponse(
				`User ${req.user.slug} is not authorized to update this bootcamp`
			)
		)

	if (!req.files) {
		return next(new ErrorResponse("Please upload a file", 400))
	}

	const { file } = req.files

	// Make sure the image is a photo
	if (!file.mimetype.startsWith("image")) {
		return next(new ErrorResponse("Please upload an image file", 400))
	}

	// 1 kb = 1024b and 1mb = 1024kb so the max file size is 1mb
	const maxFileSize = 2 * 1024 * 1024

	// Check file size
	if (file.size > maxFileSize) {
		return next(
			new ErrorResponse(
				`Please upload an image less than ${maxFileSize}`,
				400
			)
		)
	}

	// Create custom file name
	file.name = `${bootcamp.slug}${path.extname(file.name)}`

	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
		if (err) {
			console.log(err)

			next(new ErrorResponse("Problem with file upload", 500))
		} else {
			await Bootcamp.findOneAndUpdate(
				{ slug: req.params.slug },
				{
					photo: file.name,
				}
			)

			res.status(200).json({
				success: true,
				data: file.name,
			})
		}
	})
})

// @desc    Delete a bootcamp
// @route   DELETE /api/bootcamps/:slug
// @access  Private
const deleteBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findOne({ slug: req.params.slug })

	if (!bootcamp)
		next(
			new ErrorResponse(
				`Bootcamp not found with id of ${req.params.slug}`,
				404
			)
		)

	// Make sure user is bootcamp owner
	if (bootcamp.userSlug !== req.user.slug && req.user.role !== "admin")
		return next(
			new ErrorResponse(
				`User ${req.user.slug} is not authorized to update this bootcamp`
			)
		)

	await bootcamp.remove()
	const Bootcamps = await Bootcamp.find()
	res.status(200).json({
		success: true,
		count: Bootcamps.length,
		data: Bootcamps,
	})
})

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults)
})

module.exports = {
	getBootcamp,
	getBootcamps,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	bootcampPhotoUpload,
	getBootcampsInRadius,
}
