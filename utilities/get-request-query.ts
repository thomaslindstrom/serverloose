import type {Context} from '../types';
import getRequestUrl from './get-request-url';

/**
 * Get the query for a request
 * @param {object} request - request object
 * @param {string|array} keys - query keys
 *
 * @returns {function|string|array} getQuery|query|queries
 **/
export default function getRequestQuery(
	request: Context['request'],
	keys: string[]
) {
	const url = getRequestUrl(request);

	if (url) {
		const getQuery = (keys: string[]) => {
			if (Array.isArray(keys)) {
				return keys.map((i) => url.searchParams.get(i));
			}

			return url.searchParams.get(keys);
		};

		return keys ? getQuery(keys) : getQuery;
	}

	return null;
}
