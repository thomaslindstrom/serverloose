import {parse as parseContentType} from 'content-type';
import parseJson from 'body/json';
import {type Context} from '../types';
import {BadInputError, InvalidInputError} from './errors';
import getRequestHeader from './get-request-header';

const validContentTypes = new Set(['application/json']);

export type ParseRequestJsonOptions = {
	ignoreContentType?: boolean;
};

/**
 * Parse incoming request json
 * @param {object} request - node request object
 * @param {object} options - parse options
 * @param {boolean} options.ignoreContentType - ignore content type header
 * @returns {object} body
 **/
export default async function parseRequestJson<Type>(
	request: Context['request'],
	options: ParseRequestJsonOptions = {}
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

	return new Promise<Type>((resolve, reject) => {
		parseJson(request, (error, body) => {
			if (error) {
				reject(
					new InvalidInputError({
						message: 'Invalid JSON input',
						code: 'invalid_json_input'
					})
				);
			} else {
				resolve(body as Type);
			}
		});
	});
}
