const asyncHandler = fn => (req, res, next) =>
	Promise.resolve(fn(req, res, next)).catch(next)

// It takes the async function as a parameter and return a modified function that can handle errors

module.exports = asyncHandler
