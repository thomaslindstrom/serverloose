/**
 * Handle server response
 * @param {object} context - context object
 * @param {object} body - output body
 * @param {object} options - response options
**/
function handleResponse({response}, body = {}, options = {}) {
	if (response.finished) {
		return;
	}

	response.statusCode = 200;
	response.setHeader('content-type', (options.contentType || 'application/json'));

	if (!options.contentType || (options.contentType === 'application/json')) {
		response.end(JSON.stringify({success: true, ...body}));
	} else {
		response.end(body);
	}
}

module.exports = handleResponse;
