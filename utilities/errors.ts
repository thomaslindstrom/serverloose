export type ServerlooseError = {
	isServerlooseError?: true;
	type?: string;
	code?: string;
	status?: number;
} & Error;

export function isServerlooseError(input: unknown): input is ServerlooseError {
	return (
		typeof input === 'object' &&
		input !== null &&
		'ServerlooseError' in input &&
		(input as unknown as ServerlooseError).isServerlooseError === true
	);
}

export class MethodNotAllowedError extends Error {
	constructor() {
		super();

		const error: ServerlooseError = new Error('Method not allowed');

		error.isServerlooseError = true;
		error.type = 'MethodNotAllowed';
		error.status = 405;
		error.code = 'method_not_allowed';

		return error;
	}
}

export class NotFoundError extends Error {
	constructor({type}: {type: string}, object: Record<string, string>) {
		super();

		const error: ServerlooseError = new Error(
			`${type} not found: ${Object.entries(object)
				.map(([key, value]) => `${key}=\`${value}\``)
				.join(' & ')}`
		);

		error.isServerlooseError = true;
		error.type = 'NotFound';
		error.status = 404;
		error.code = `${type.toLowerCase()}_not_found`;

		return error;
	}
}

export class BadInputError extends Error {
	constructor({message, code}: {message: string; code: string}) {
		super();
		const error: ServerlooseError = new Error(message);

		error.isServerlooseError = true;
		error.type = 'BadInputError';
		error.status = 400;
		error.code = code;

		return error;
	}
}

export class InvalidInputError extends Error {
	constructor({message, code}: {message: string; code: string}) {
		super();
		const error: ServerlooseError = new Error(message);

		error.isServerlooseError = true;
		error.type = 'InvalidInputError';
		error.status = 422;
		error.code = code;

		return error;
	}
}

export class MissingParametersError extends Error {
	constructor(object: Record<string, any>) {
		super();

		const entries = Object.entries(object);
		const error: ServerlooseError = new Error(
			`Missing parameter${entries.length === 1 ? '' : 's'}: ${entries
				.map(([key]) => `${key}`)
				.join(' | ')}`
		);

		error.isServerlooseError = true;
		error.type = 'MissingParameters';
		error.status = 400;
		error.code = 'missing_parameters';

		return error;
	}
}

export class MissingRequiredParametersError extends Error {
	constructor(object: Record<string, any>) {
		super();

		const entries = Object.entries(object).filter(([_, value]) => !value);
		const error: ServerlooseError = new Error(
			`Missing required parameter${entries.length === 1 ? '' : 's'}: ${entries
				.map(([key]) => `${key}`)
				.join(' & ')}`
		);

		error.isServerlooseError = true;
		error.type = 'MissingRequiredParameters';
		error.status = 400;
		error.code = 'missing_required_parameters';

		return error;
	}
}

export class UnknownError extends Error {
	constructor() {
		super();
		const error: ServerlooseError = new Error('Unexpected unknown error');

		error.isServerlooseError = true;
		error.type = 'UnknownError';
		error.status = 500;
		error.code = 'unknown_error';

		return error;
	}
}

export class FatalError extends Error {
	constructor() {
		super();
		const error: ServerlooseError = new Error('Unexpected fatal error');

		error.isServerlooseError = true;
		error.type = 'FatalError';
		error.status = 500;
		error.code = 'fatal_error';

		return error;
	}
}
