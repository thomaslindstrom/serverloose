# serverloose

serverless utilities

```
npm install serverloose
```

## Usage

In your serverless application, create request handlers by importing the handler function utility. `responder` is the first argument and should be a `function`. It can be asynchronous.

```javascript
import handler from 'serverloose';

export default handler(() => ({
	message: 'hello'
}));
```

The default response content type is `application/json`. To change this, set the `contentType` property on the options object:

```javascript
import handler from 'serverloose';

export default handler(() => (
	'<h1>hello</h1>'
), {contentType: 'text/html'});
```

To restrict available request methods, set the `methods` property on the options object:

```javascript
import handler from 'serverloose';

export default handler(() => (
	'<h1>hello</h1>'
), {methods: ['post']});
```

### Parsing URLs and incoming body

#### Parsing incoming URL

```javascript
import handler, {getRequestUrl} from 'serverloose';

export default handler(({request}) => ({
	url: getRequestUrl(request)
}));
```

#### Parsing query strings

```javascript
import handler, {getRequestQuery} from 'serverloose';

export default handler(({request}) => ({
	query: getRequestQuery(request, 'query')
}));
```

```javascript
import handler, {getRequestQuery} from 'serverloose';

export default handler(({request}) => {
	const [id, name] = getRequestQuery(request, ['id', 'name']);
	return {id, name};
});
```

```javascript
import handler, {getRequestQuery} from 'serverloose';

export default handler(({request}) => {
	const getQuery = getRequestQuery(request);

	if (getQuery('test')) {
		return {test: getQuery('test')};
	}

	return {test: false};
});
```

#### Parsing incoming body

```javascript
import handler, {parseRequestJson} from 'serverloose';

export default handler(async ({request}) => {
	const body = await parseRequestJson(request);
	return {body, type: 'json'};
});
```

```javascript
import handler, {parseRequestForm} from 'serverloose';

export default handler(async ({request}) => {
	const body = await parseRequestForm(request);
	return {body, type: 'form'};
});
```

### Errors

Throwing inside the `responder` function is encouraged:

```javascript
import handler from 'serverloose';

export default handler(() => {
	const error = new Error('Unauthorized');

	error.status = 401;
	error.code = error.type = 'unauthorized';

	throw error;
});
```

This will respond the following body with status `401`:

```json
{"success":false,"error":{"code":"unauthorized","message":"Unauthorized"}}
```

If `error.type` is not set, the output error will be obfuscated to prevent loss of critical information. The error is logged to the server.

```json
{"success":false,"error":{"code":"unknown_error","message":"Unknown error"}}
```


