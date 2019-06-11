const errors = require('@amphibian/errors');
const parseJson = require('body/json');

module.exports = function parseRequestJson(request) {
	const contentType = request.headers['content-type'];

	if (!contentType) {
		return Promise.reject(errors.invalidInput('missing_content_type_header'));
	}

	if (contentType !== 'application/json') {
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
