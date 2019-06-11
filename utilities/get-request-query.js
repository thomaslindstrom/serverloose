const getRequestUrl = require('./get-request-url');

/**
 * Get the query for a request
 * @param {object} request - request object
 * @param {string} key - query key
 *
 * @returns {function|string} getQuery|query
**/
function getRequestQuery(request, key) {
	const url = getRequestUrl(request);

	function getQuery(...parameters) {
		const queries = parameters.map((parameter) => url.searchParams.get(parameter));

		if (queries.length === 1) {
			return queries[0];
		}

		return queries;
	}

	return (key) ? getQuery(key) : getQuery;
}

module.exports = getRequestQuery;
