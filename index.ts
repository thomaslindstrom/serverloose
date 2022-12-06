import {type OutgoingHttpHeader} from 'node:http';
import type {Context, Responder, ResponderOptions} from './types';
import handleResponse from './utilities/handle-response';
import handleError from './utilities/handle-error';
import {MethodNotAllowedError} from './utilities/errors';

export * from './utilities/errors';

export * from './utilities/get-request-query';
export {default as getRequestQuery} from './utilities/get-request-query';

export * from './utilities/get-request-url';
export {default as getRequestUrl} from './utilities/get-request-url';

export * from './utilities/handle-error';
export {default as handleError} from './utilities/handle-error';

export * from './utilities/handle-response';
export {default as handleResponse} from './utilities/handle-response';

export * from './utilities/parse-request-file';
export {default as parseRequestFile} from './utilities/parse-request-file';

export * from './utilities/parse-request-form';
export {default as parseRequestForm} from './utilities/parse-request-form';

export * from './utilities/parse-request-json';
export {default as parseRequestJson} from './utilities/parse-request-json';

export * from './utilities/parse-request-text';
export {default as parseRequestText} from './utilities/parse-request-text';

const defaultResponseHeaders = {
	'access-control-allow-origin': '*',
	'access-control-max-age': 3600,
	'x-frame-options': 'DENY',
	'x-content-type-options': 'nosniff',
	'strict-transport-security': 'max-age=16070400; includeSubDomains'
};

const responseListHeaders = new Set([
	'access-control-allow-methods',
	'access-control-allow-headers'
]);

function patchResponseListHeader(
	response: Context['response'],
	header: string,
	value: OutgoingHttpHeader
) {
	if (response.hasHeader(header)) {
		const headerValue = response.getHeader(header);

		if (typeof headerValue === 'string') {
			const currentValues = headerValue.split(/\s*?,\s*?/);
			const stringedValue = String(value);

			if (!currentValues.includes(stringedValue)) {
				response.setHeader(
					header,
					currentValues.concat(stringedValue).join(', ')
				);
			}
		}
	}
}

/**
 * Handler function utility
 * @param {function} responder - responder function
 * @param {object} options - handler options
 *
 * @returns {function} handler - prepared handler
 **/
function handler(responder: Responder, options: ResponderOptions = {}) {
	const supportedMethods = options.methods?.map((method) =>
		method.toUpperCase()
	);

	const responseHeaders = {
		...defaultResponseHeaders,
		'access-control-allow-methods': supportedMethods
			? supportedMethods.join(', ')
			: 'GET',
		'access-control-allow-headers': options.headers
			? options.headers.join(', ')
			: ''
	};

	return async (request: Context['request'], response: Context['response']) => {
		const context = {request, response};

		for (const [key, value] of Object.entries(responseHeaders)) {
			if (response.hasHeader(key)) {
				if (responseListHeaders.has(key)) {
					patchResponseListHeader(response, key, value);
				}
			} else {
				response.setHeader(key, value);
			}
		}

		if (supportedMethods) {
			const requestMethod = (request.method ?? 'GET').toUpperCase();

			if (requestMethod === 'OPTIONS') {
				if (!response.hasHeader('cache-control')) {
					response.setHeader(
						'cache-control',
						'public, s-maxage=30, max-age=30, stale-while-revalidate'
					);
				}

				return response.end(supportedMethods.join(', '));
			}

			if (!supportedMethods.includes(requestMethod)) {
				handleError(context, new MethodNotAllowedError());
				return;
			}
		}

		try {
			handleResponse(context, await responder(context));
		} catch (error: unknown) {
			handleError(context, error as Error);
		}
	};
}

export default handler;
