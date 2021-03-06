const {parse: parseContentType} = require('content-type');
const parseJson = require('body/json');
const errors = require('@amphibian/errors');

const validContentTypes = ['application/json'];

/**
 * Parse incoming request json
 * @param {object} request - node request object
 * @returns {object} body
**/
function parseRequestJson(request) {
	const contentType = request.headers['content-type'];

	if (!contentType) {
		return Promise.reject(errors.invalidInput('missing_content_type_header'));
	}

	const {type: parsedContentType} = parseContentType(contentType);

	if (!validContentTypes.includes(parsedContentType)) {
		return Promise.reject(errors.invalidInput('invalid_content_type_header'));
	}

	return new Promise((resolve, reject) => {
		parseJson(request, (error, body) => {
			if (error) {
				reject(errors.invalidInput('invalid_json_input'));
			} else {
				resolve(body);
			}
		});
	});
}

module.exports = parseRequestJson;
