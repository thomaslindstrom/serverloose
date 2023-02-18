import type {Context} from '../types';
import {
	isServerlooseError,
	type ServerlooseError,
	UnknownError
} from './errors';

/**
 * Handle server error
 * @param {object} context - context object
 * @param {object} error - error object
 **/
export default function handleError({response}: Context, error: Error) {
	let outputError: ServerlooseError;

	if (isServerlooseError(error)) {
		outputError = error;
	} else {
		outputError = new UnknownError();
		console.error(error);
	}

	if (response.writableEnded) {
		return;
	}

	if (response.finished) {
		return;
	}

	response.statusCode = outputError.status ?? 500;
	response.setHeader('content-type', 'application/json');
	response.end(
		JSON.stringify({
			success: false,
			error: {
				type: outputError.type,
				code: outputError.code,
				message: outputError.message
			}
		})
	);
}
