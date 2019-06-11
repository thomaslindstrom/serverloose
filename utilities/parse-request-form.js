const errors = require('@amphibian/errors');
const {parse: parseContentType} = require('content-type');
const parseForm = require('body/form');

const validContentTypes = ['application/x-www-form-urlencoded', 'multipart/form-data'];

function parseRequestForm(request) {
	const contentType = request.headers['content-type'];

	if (!contentType) {
		return Promise.reject(errors.invalidInput('missing_content_type_header'));
	}

	const {type: parsedContentType} = parseContentType(contentType);

	if (!validContentTypes.includes(parsedContentType)) {
		return Promise.reject(errors.invalidInput('invalid_content_type_header'));
	}

	return new Promise((resolve, reject) => {
		parseForm(request, (error, body) => {
			if (error) {
				reject(errors.invalidInput('invalid_form_input'));
			} else {
				resolve(body);
			}
		});
	});
}

module.exports = parseRequestForm;
