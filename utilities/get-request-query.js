const getRequestUrl = require('./get-request-url');

/**
 * Get the query for a request
 * @param {object} request - request object
 * @param {string|array} keys - query keys
 *
 * @returns {function|string|array} getQuery|query|queries
**/
function getRequestQuery(request, keys) {
	const url = getRequestUrl(request);

	function getQuery(keys) {
		if (Array.isArray(keys)) {
			return keys.map((i) => url.searchParams.get(i));
		}

		return url.searchParams.get(keys);
	}

	return (keys) ? getQuery(keys) : getQuery;
}

module.exports = getRequestQuery;
