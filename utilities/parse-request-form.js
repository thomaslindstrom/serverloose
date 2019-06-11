const errors = require('@amphibian/errors');
const parseForm = require('body/form');

const contentTypes = ['application/x-www-form-urlencoded', 'multipart/form-data'];

module.exports = function parseRequestForm(request) {
	const contentType = request.headers['content-type'];

	if (!contentType) {
		return Promise.reject(errors.invalidInput('missing_content_type_header'));
	}

	if (!contentTypes.includes(contentType)) {
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
