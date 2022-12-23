import {type ServerResponse, type IncomingMessage} from 'node:http';
import {type NextRequest} from 'next/server';

export type Context = {
	request: IncomingMessage | NextRequest;
	response: ServerResponse;
};
export type HeaderValue = string | number | string[];
export type Headers = Record<string, HeaderValue>;
export type Responder = (context: Context) => any;
export type ResponderOptions = {
	methods?: string[];
	headers?: string[];
};
