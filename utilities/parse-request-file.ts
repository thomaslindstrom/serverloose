import {parse as parseContentType} from 'content-type';
import multer from 'multer';
import {type Context} from '../types';
import {
	BadInputError,
	InvalidInputError,
	MissingRequiredParametersError
} from './errors';
import getRequestHeader from './get-request-header';

const validContentTypes = new Set(['multipart/form-data']);
const processRequestFile = multer({storage: multer.memoryStorage()});

export type ParseRequestFileOptions = {
	ignoreContentType?: boolean;
};

export type ParsedRequestFile = {
	buffer: Buffer;
	name: string;
	encoding: string;
	type: string;
	size: number;
};

/**
 * Parse request file
 * @param {string} field - multipart form field to process
 * @param {object} request - node request object
 * @param {object} options - parse options
 * @param {boolean} options.ignoreContentType - ignore content type header
 * @returns {object} information
 **/
export default async function parseRequestFile(
	field: string,
	request: Context['request'],
	options: ParseRequestFileOptions = {}
): Promise<ParsedRequestFile> {
	if (!field) {
		throw new MissingRequiredParametersError({field});
	}

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
		processRequestFile.single(field)(request, undefined, () => {
			const {file} = request;

			if (!file) {
				reject(
					new InvalidInputError({
						message: 'Nothing to upload',
						code: 'nothing_to_upload'
					})
				);

				return;
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
