const errors = require('@amphibian/errors');
const handleResponse = require('./utilities/handle-response');
const handleError = require('./utilities/handle-error');
const getRequestUrl = require('./utilities/get-request-url');
const getRequestQuery = require('./utilities/get-request-query');
const parseRequestText = require('./utilities/parse-request-text');
const parseRequestJson = require('./utilities/parse-request-json');
const parseRequestForm = require('./utilities/parse-request-form');

Object.defineProperty(exports, '__esModule', {value: true});

exports.handleResponse = handleResponse;
exports.handleError = handleError;
exports.getRequestUrl = getRequestUrl;
exports.getRequestQuery = getRequestQuery;
exports.parseRequestText = parseRequestText;
exports.parseRequestJson = parseRequestJson;
exports.parseRequestForm = parseRequestForm;

const defaultResponseHeaders = {
	'access-control-allow-origin': '*',
	'access-control-max-age': 3600,
	'x-frame-options': 'DENY',
	'x-content-type-options': 'nosniff',
	'strict-transport-security': 'max-age=16070400; includeSubDomains'
};

/**
 * Handler function utility
 * @param {function} responder - responder function
 * @param {object} options - handler options
 *
 * @returns {function} handler - prepared handler
**/
function handler(responder, options = {}) {
	const supportedMethods = options.methods
		&& options.methods.map((method) => method.toUpperCase());
	const responseHeaders = {
		...defaultResponseHeaders,
		'access-control-allow-methods': (supportedMethods)
			? supportedMethods.join(', ')
			: 'GET',
		'access-control-allow-headers': (options.headers)
			? options.headers.join(', ')
			: ''
	};

	return async (request, response) => {
		const context = {request, response};

		Object.entries(responseHeaders).forEach(([key, value]) => {
			response.setHeader(key, value);
		});

		if (supportedMethods) {
			const requestMethod = request.method.toUpperCase();

			if (requestMethod === 'OPTIONS') {
				return response.end(supportedMethods.join(', '));
			}

			if (!supportedMethods.includes(requestMethod)) {
				const error = errors.methodNotAllowed();
				return handleError(context, error, options);
			}
		}

		try {
			handleResponse(context, await responder(context), options);
		} catch (error) {
			handleError(context, error, options);
		}
	};
}

exports.default = handler;
