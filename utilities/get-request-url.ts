import {URL} from 'node:url';
import type {Context} from '../types';

/**
 * Get the parsed url object for a request
 * @param {object} request - request object
 * @returns {object} urlObject
 **/
export default function getRequestUrl(request: Context['request']) {
	if ('url' in request && request.url) {
		const forwardedProtocolHeader = request.headers['x-forwarded-proto'];
		let protocol = 'http:';

		if (forwardedProtocolHeader) {
			const forwardedProtocol = Array.isArray(forwardedProtocolHeader)
				? forwardedProtocolHeader[0]
				: forwardedProtocolHeader;

			protocol = `${forwardedProtocol}:`;
		}

		const forwardedHostHeader = request.headers['x-forwarded-host'];
		const forwardedHost = Array.isArray(forwardedHostHeader)
			? forwardedHostHeader[0]
			: forwardedHostHeader;

		const host = forwardedHost ?? request.headers.host ?? '';
		return new URL(request.url, `${protocol}://${host}`);
	}
}
