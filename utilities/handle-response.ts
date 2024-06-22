import {type Context} from '../types';

/**
 * Handle server response
 * @param {object} context - context object
 * @param {object} body - output body
 **/
export default function handleResponse({response}: Context, body: any = {}) {
	if (response.writableEnded) {
		return;
	}

	if (response.finished) {
		return;
	}

	response.statusCode = 200;

	if (response.hasHeader('content-type')) {
		const header = response.getHeader('content-type');

		if (
			typeof header === 'string' &&
			typeof body !== 'string' &&
			['application/json', 'application/json; charset=utf-8'].includes(header)
		) {
			response.end(JSON.stringify({success: true, ...body}));
			return;
		}

		response.end(body);
		return;
	}

	response.setHeader('content-type', 'application/json; charset=utf-8');
	response.end(JSON.stringify({success: true, ...body}));
}
