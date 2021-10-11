const {parse: parseContentType} = require('content-type');
const multer = require('multer');
const errors = require('@amphibian/errors');

const validContentTypes = new Set(['multipart/form-data']);
const processRequestFile = multer({storage: multer.memoryStorage()});

/**
 * Parse request file
 * @param {string} field - multipart form field to process
 * @param {object} request - node request object
 * @param {object} options - parse options
 * @param {boolean} options.ignoreContentType - ignore content type header
 * @returns {object} information
**/
function parseRequestFile(field, request, options = {}) {
	if (!field) {
		return Promise.reject(errors.missingRequiredParameters(undefined, 'field'));
	}

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
		processRequestFile.single(field)(request, undefined, () => {
			const {file} = request;

			if (!file) {
				return reject(errors.invalidInput('nothing_to_upload'));
			}

			resolve({
				buffer: file.buffer,
				name: file.originalname,
				encoding: file.encoding,
				type: file.mimetype,
				size: file.size
			});
		});
	});
}

module.exports = parseRequestFile;
