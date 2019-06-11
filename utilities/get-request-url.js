const {URL} = require('url');

/**
 * Get the parsed url object for a request
 * @param {object} request - request object
 * @returns {object} urlObject
**/
function getRequestUrl(request) {
	const protocol = (request.connection.encrypted) ? 'https' : 'http';
	return new URL(request.url, `${protocol}://${request.headers.host}`);
}

module.exports = getRequestUrl;
