/**
 * Expect a function to throw
 * @param {function} test - the test function
 * @param {function} callback - the callback
 **/
async function expectToThrow(test, callback) {
	try {
		await test();
	} catch (error) {
		callback(error);
		return;
	}

	throw new Error('No error thrown.');
}

/**
 * Generate a random string
 * @returns {string}
 **/
function randomString() {
	return Math.random().toString(36).slice(2);
}

/**
 * Delay X milliseconds
 * @param {number} milliseconds - the number of milliseconds to wait
 * @returns {promise}
 **/
function delay(milliseconds) {
	return new Promise((resolve) => {
		setTimeout(resolve, milliseconds);
	});
}

test('callback with error on test failure', () => {
	const errorMessage = 'Some error';

	return expectToThrow(
		() => {
			throw new Error(errorMessage);
		},
		(error) => {
			expect(error.message).toBe(errorMessage);
		}
	);
});

test('failing: throw when no errors are thrown', async () => {
	try {
		await expectToThrow(() => {});
	} catch (error) {
		expect(error.message).toBe('No error thrown.');
		return;
	}

	throw new Error('No error thrown.');
});

test('get a random string', () => {
	expect(typeof randomString()).toBe('string');
});

test('wait X milliseconds', () => delay(250));
