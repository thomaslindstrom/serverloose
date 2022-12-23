import {type NextRequest, NextResponse} from 'next/server';

import type {HeaderValue, Headers, ResponderOptions} from './types';
import {
	MethodNotAllowedError,
	type ServerlooseError,
	UnknownError,
	isServerlooseError
} from './utilities/errors';

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

const defaultResponseHeaders: Array<[string, string]> = [
	['access-control-allow-origin', '*'],
	['access-control-max-age', '3600'],
	['x-frame-options', 'DENY'],
	['x-content-type-options', 'nosniff'],
	['strict-transport-security', 'max-age=16070400; includeSubDomains']
];

function handleError(error: Error) {
	let outputError: ServerlooseError;

	if (isServerlooseError(error)) {
		outputError = error;
	} else {
		outputError = new UnknownError();
		console.error(error);
	}

	return NextResponse.json(
		{
			success: false,
			error: {
				type: outputError.type,
				code: outputError.code,
				message: outputError.message
			}
		},
		{status: outputError.status ?? 500}
	);
}

export type EdgeResponder = (request: NextRequest) => Promise<NextResponse>;

/**
 * Edge handler function utility
 * @param {function} responder - edge responder function
 * @param {object} options - handler options
 *
 * @returns {function} handler - prepared handler
 **/
function handler(responder: EdgeResponder, options: ResponderOptions = {}) {
	const supportedMethods = options.methods?.map((method) =>
		method.toUpperCase()
	);

	const headers: HeadersInit = [
		...defaultResponseHeaders,
		[
			'access-control-allow-methods',
			supportedMethods ? supportedMethods.join(', ') : 'GET'
		],
		[
			'access-control-allow-headers',
			options.headers ? options.headers.join(', ') : ''
		]
	];

	return async (request: NextRequest) => {
		const responseHeaders: HeadersInit = headers;

		if (supportedMethods) {
			const requestMethod = (request.method ?? 'GET').toUpperCase();

			if (requestMethod === 'OPTIONS') {
				if (!responseHeaders.some(([header]) => header === 'cache-control')) {
					responseHeaders.push([
						'cache-control',
						'public, s-maxage=30, max-age=30, stale-while-revalidate'
					]);
				}

				return new NextResponse(supportedMethods.join(', '), {
					headers: responseHeaders
				});
			}

			if (!supportedMethods.includes(requestMethod)) {
				return handleError(new MethodNotAllowedError());
			}
		}

		try {
			const response = await responder(request);

			for (const [key, value] of responseHeaders) {
				if (!response.headers.has(key)) {
					response.headers.set(key, value);
				}
			}

			return response;
		} catch (error: unknown) {
			return handleError(error as Error);
		}
	};
}

export default handler;
