const path = require("path")

// import the schema
const Bootcamp = require("../models/Bootcamp")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/asyncHandler")

// @desc    Get all bootcamps
// @route   GET /api/bootcamps
// @access  Public

// using async handler to prevent repetitive code
const getBootcamps = asyncHandler(async (req, res, next) => {
	// copy req.query
	const reqQuery = { ...req.query }

	// Fields to exlude
	const removeFields = ["select", "sort", "page", "limit"]

	// Loop over removeFields and delete them from query
	removeFields.forEach(param => delete reqQuery[param])

	// Create query string
	let queryStr = JSON.stringify(reqQuery)

	// Create operator ($gt, $gte, etc.)
	queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

	// Finding resource
	let query = Bootcamp.find(JSON.parse(queryStr))

	// Select Fields
	if (req.query.select) {
		// include the select values, exclude other fields
		const fields = req.query.select.split(",").join(" ")
		query = query.select(fields)
	}

	// Sort
	if (req.query.sort) {
		const sortBy = req.query.sort.split(",").join(" ")
		query = query.sort(sortBy)
	} else {
		query = query.sort("-createdAt")
	}

	// Pagination
	const page = parseInt(req.query.page, 10) || 1,
		limit = parseInt(req.query.limit, 10) || 10,
		// get the number of documents to skip
		// if page is 1, it will skip 0 docs
		// if page is 3, then it will skip 2 pages ahead, i.e. , 2x2(default) docs
		startIndex = (page - 1) * limit,
		// get the endIndex (total number of documents in page)
		endIndex = page * limit,
		total = await Bootcamp.countDocuments(),
		totalPages = Math.ceil(total / limit)

	query = query.skip(startIndex).limit(limit)

	// Executing query
	const bootcamps = await query

	// Pagination result
	const pagination = { totalPages, currentPage: page, limit }

	// if its not the last page
	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
		}
	}

	// if its not the first page
	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
		}
	}

	console.log(
		`Start index: ${startIndex}, End index: ${endIndex}, Total: ${total}, Limit: ${limit}, Total pages: ${totalPages}`
	)

	res.status(200).json({
		success: true,
		count: bootcamps.length,
		pagination,
		data: bootcamps,
	})
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
				`Bootcamp not found with id of ${req.params.id}`,
				404
			)
		)
	}
})

// @desc    Create a new bootcamp
// @route   POST /api/bootcamps
// @access  Private
const createBootcamp = asyncHandler(async (req, res, next) => {
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
	// passing three parameters to the findByIdAndUpdate function, one the id, second the updted data and third (optional) for more configuration
	const bootcamp = await Bootcamp.findOneAndUpdate(
		{ slug: req.params.slug },
		req.body,
		{
			// to get the updated data as response
			new: true,
			runValidators: true,
		}
	)

	if (bootcamp) {
		res.status(200).json({
			success: true,
			data: bootcamp,
		})
	} else {
		next(
			new ErrorResponse(
				`Bootcamp not found with id of ${req.params.id}`,
				404
			)
		)
	}
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

	if (bootcamp) {
		await bootcamp.remove()
		const Bootcamps = await Bootcamp.find()
		res.status(200).json({
			success: true,
			count: Bootcamps.length,
			data: Bootcamps,
		})
	} else {
		next(
			new ErrorResponse(
				`Bootcamp not found with id of ${req.params.slug}`,
				404
			)
		)
	}
})

module.exports = {
	getBootcamp,
	getBootcamps,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	bootcampPhotoUpload,
}
