const advancedResults = (model, populate) => async (req, res, next) => {
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
	let query = model.find(JSON.parse(queryStr))

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
		total = await model.countDocuments(),
		totalPages = Math.ceil(total / limit)

	query = query.skip(startIndex).limit(limit)

	// Populate if populate is passed
	if (populate) {
		query = query.populate(populate)
	}

	// Executing query
	const results = await query

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

	res.advancedResults = {
		success: true,
		count: results.length,
		pagination,
		data: results,
	}

	next()
}

module.exports = advancedResults
