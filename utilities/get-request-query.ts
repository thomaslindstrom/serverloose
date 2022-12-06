import type {Context} from '../types';
import getRequestUrl from './get-request-url';

function getQuery(url: URL, keys: string | string[]) {
	if (Array.isArray(keys)) {
		return keys.map((i) => url.searchParams.get(i));
	}

	return url.searchParams.get(keys);
}

export default function getRequestQuery(
	request: Context['request']
): (keys: string | string[]) => ReturnType<typeof getQuery>;

export default function getRequestQuery(
	request: Context['request'],
	key: string
): string;

export default function getRequestQuery(
	request: Context['request'],
	keys: string[]
): string[];

/**
 * Get the query for a request
 * @param {object} request - request object
 * @param {string|array} keys - query keys
 *
 * @returns {function|string|array} getQuery|query|queries
 **/
export default function getRequestQuery(
	request: Context['request'],
	keys?: string | string[]
) {
	const url = getRequestUrl(request);

	if (url) {
		return keys
			? getQuery(url, keys)
			: (keys: string | string[]) => getQuery(url, keys);
	}

	return null;
}
