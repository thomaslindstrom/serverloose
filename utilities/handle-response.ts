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

	response.statusCode = 200;

	if (response.hasHeader('content-type')) {
		response.end(body);
	} else {
		response.setHeader('content-type', 'application/json; charset=utf-8');
		response.end(JSON.stringify({success: true, ...body}));
	}
}
