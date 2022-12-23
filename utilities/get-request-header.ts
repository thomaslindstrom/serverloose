import {type Context} from '../types';

function isRequest(request: Context['request']): request is Request {
	return !('aborted' in request);
}

/**
 * Get a header value from the request object
 * @param {object} request - request object
 * @param {string} header - header key
 * @returns {string | number | string[] | undefined} headerValue
 **/
export default function getRequestHeader(
	request: Context['request'],
	header: string
) {
	const value = isRequest(request)
		? request.headers.get(header)
		: request.headers[header];

	if (typeof value === 'string') {
		return value;
	}

	if (Array.isArray(value)) {
		return value[0];
	}

	return value;
}
