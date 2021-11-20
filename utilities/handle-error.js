/**
 * Handle server error
 * @param {object} context - context object
 * @param {object} error - error object
**/
function handleError({response}, error) {
	let outputError = error;

	if (!error.type || (error.type === 'fatal_error')) {
		console.error(error.stack);

		const genericError = new Error('Unknown Error');
		genericError.code = 'unknown_error';
		outputError = genericError;
	}

	response.statusCode = outputError.status || 500;
	response.setHeader('content-type', 'application/json');
	response.end(
		JSON.stringify({
			success: false,
			error: {
				type: outputError.type,
				code: outputError.code,
				message: outputError.message
			}
		})
	);
}

module.exports = handleError;
