import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { BACKEND_URL } from '$env/static/private';
import { errorCode } from '$lib/helpers';
import type { HttpResult } from '$lib/types/result';

export const DELETE: RequestHandler = async ({ fetch, url }) => {
	const tableNames = url.searchParams.get('names');

	let result: HttpResult<undefined> = {
		success: false,
		code: 500,
		message: 'Unexpected error.'
	};

	const response = await fetch(`${BACKEND_URL}/tables/${tableNames}`, { method: 'DELETE' });

	result = {
		success: response.ok,
		code: response.status,
		message: response.ok ? `Sucessfully deleted table: ${tableNames}` : await response.text()
	};

	console.log(result.message);

	if (!result.success) {
		error(errorCode(result.code), result.message);
	}

	return json(result);
};
