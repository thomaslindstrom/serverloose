import {type Context} from '../types';
import getRequestHeader from './get-request-header';

/**
 * Get the parsed url object for a request
 * @param {object} request - request object
 * @returns {object} urlObject
 **/
export default function getRequestUrl(request: Context['request']) {
	if ('url' in request && request.url) {
		let forwardedProtocol = getRequestHeader(request, 'x-forwarded-proto');

		if (forwardedProtocol?.includes(',')) {
			forwardedProtocol = forwardedProtocol.split(',')[0];
		}

		const protocol = forwardedProtocol ? `${forwardedProtocol}:` : 'http:';
		const forwardedHost = getRequestHeader(request, 'x-forwarded-host');
		const host = forwardedHost ?? getRequestHeader(request, 'host') ?? '';

		return new URL(request.url, `${protocol}//${host}`);
	}
}
