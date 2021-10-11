const {parse: parseContentType} = require('content-type');
const parseText = require('body');
const errors = require('@amphibian/errors');

const validContentTypes = new Set(['text/plain']);

/**
 * Parse incoming request text
 * @param {object} request - node request object
 * @param {object} options - parse options
 * @param {boolean} options.ignoreContentType - ignore content type header
 * @returns {string} text
**/
function parseRequestText(request, options = {}) {
	if (options.ignoreContentType !== false) {
		const contentType = request.headers['content-type'];

		if (!contentType) {
			return Promise.reject(errors.invalidInput('missing_content_type_header'));
		}

		const {type: parsedContentType} = parseContentType(contentType);

		if (!validContentTypes.has(parsedContentType)) {
			return Promise.reject(errors.invalidInput('invalid_content_type_header'));
		}
	}

	return new Promise((resolve, reject) => {
		parseText(request, (error, body) => {
			if (error) {
				reject(errors.invalidInput('invalid_text_input'));
			} else {
				resolve(body);
			}
		});
	});
}

module.exports = parseRequestText;
