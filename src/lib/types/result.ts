export type HttpResult<T> = {
	success: boolean;
	code: number;
	message: string;
	data?: T;
};

export type RequestStatus = {
	type: 'success' | 'failure' | 'pending' | 'none' | 'unknown';
	message: string;
};
