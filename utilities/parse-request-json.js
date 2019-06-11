const errors = require('@amphibian/errors');
const {parse: parseContentType} = require('content-type');
const parseJson = require('body/json');

const validContentTypes = ['application/json'];

function parseRequestJson(request) {
	const contentType = request.headers['content-type'];

	if (!contentType) {
		return Promise.reject(errors.invalidInput('missing_content_type_header'));
	}

	const {test: parsedContentType} = parseContentType(contentType);

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
