/**
 * Handle server response
 * @param {object} context - context object
 * @param {object} body - output body
**/
function handleResponse({response}, body = {}) {
	if (response.finished) {
		return;
	}

	response.statusCode = 200;

	if (response.hasHeader('content-type')) {
		response.end(body);
	} else {
		response.setHeader('content-type', 'application/json');
		response.end(JSON.stringify({success: true, ...body}));
	}
}

module.exports = handleResponse;
