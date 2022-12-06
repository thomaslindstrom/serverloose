import {type ServerResponse, type IncomingMessage} from 'node:http';

export type Context = {request: IncomingMessage; response: ServerResponse};
export type Responder = (context: Context) => any;
export type ResponderOptions = {
	methods?: string[];
	headers?: string[];
};
