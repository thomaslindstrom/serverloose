import {type ServerResponse, type IncomingMessage} from 'http';

export type Context = {
	request: IncomingMessage | Request;
	response: ServerResponse;
};

export type HeaderValue = string | number | string[];
export type Headers = Record<string, HeaderValue>;
export type Responder = (context: Context) => any;
export type ResponderOptions = {
	methods?: string[];
	headers?: string[];
};
