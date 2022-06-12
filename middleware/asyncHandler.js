// async handler combinator
const asyncHandler = fn => (req, res, next) =>
	Promise.resolve(fn(req, res, next)).catch(next)

/*
	This accepts a fn which is treated as an async handler. fn can return a promise and asyncHandler will properly wrap it and automatically connect the next callback to properly handle errors.

	This is an effective combinator because it prevents you from having to write this try-catch boilerplate for every async handler you would need -

	without asyncHandler :

	async function  getBootcamps (req, res, next) {
	try {
		const bootcamps = await Bootcamp.find()
		res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps })
	}
	catch (err) {
		next(err)
	}

	It automatically handles the "error" path for you -
}
*/

module.exports = asyncHandler
