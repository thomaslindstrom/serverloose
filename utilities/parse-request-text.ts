import {parse as parseContentType} from 'content-type';
import parseText from 'body';
import {type Context} from '../types';
import {BadInputError, InvalidInputError} from './errors';
import getRequestHeader from './get-request-header';

const validContentTypes = new Set(['text/plain']);

export type ParseRequestTextOptions = {
	ignoreContentType?: boolean;
};

/**
 * Parse incoming request text
 * @param {object} request - node request object
 * @param {object} options - parse options
 * @param {boolean} options.ignoreContentType - ignore content type header
 * @returns {string} text
 **/
export default async function parseRequestText(
	request: Context['request'],
	options: ParseRequestTextOptions = {}
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
		parseText(request, (error, body) => {
			if (error) {
				reject(
					new InvalidInputError({
						message: 'Invalid text input',
						code: 'invalid_text_input'
					})
				);
			} else {
				resolve(body);
			}
		});
	});
}
