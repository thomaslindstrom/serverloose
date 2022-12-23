import {parse as parseContentType} from 'content-type';
import parseForm from 'body/form';
import {type Context} from '../types';
import {BadInputError, InvalidInputError} from './errors';
import getRequestHeader from './get-request-header';

const validContentTypes = new Set([
	'application/x-www-form-urlencoded',
	'multipart/form-data'
]);

export type ParseRequestFormOptions = {
	ignoreContentType?: boolean;
};

/**
 * Parse incoming request form
 * @param {object} request - node request object
 * @param {object} options - parse options
 * @param {boolean} options.ignoreContentType - ignore content type header
 * @returns {object} body
 **/
export default async function parseRequestForm(
	request: Context['request'],
	options: ParseRequestFormOptions = {}
) {
	if (options.ignoreContentType !== true) {
		const contentType = getRequestHeader(request, 'content-type');

		if (!contentType) {
			throw new BadInputError({
				message: 'Missing content type header',
				code: 'missing_content_type_header'
			});
		} else if (typeof contentType !== 'string') {
			throw new BadInputError({
				message: 'Invalid content type header',
				code: 'invalid_content_Type_header'
			});
		}

		const {type: parsedContentType} = parseContentType(contentType);

		if (!validContentTypes.has(parsedContentType)) {
			throw new InvalidInputError({
				message: 'Invalid content type header',
				code: 'invalid_content_type_header'
			});
		}
	}

	return new Promise((resolve, reject) => {
		parseForm(request, (error, body) => {
			if (error) {
				reject(
					new InvalidInputError({
						message: 'Invalid form input',
						code: 'invalid_form_input'
					})
				);
			} else {
				resolve(body);
			}
		});
	});
}
