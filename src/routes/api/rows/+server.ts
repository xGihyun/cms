import { BACKEND_URL } from '$env/static/private';
import { errorCode } from '$lib/helpers';
import type { HttpResult } from '$lib/types/result';
import type { Literal, TableColumnInfo } from '$lib/types/table';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ fetch, request }) => {
	const row: { primaryKey: TableColumnInfo; values: Literal[] } = await request.json();

	console.log(row);

	const payload = {
		table: row.primaryKey.table_name,
		pkey_column: row.primaryKey.column_name,
		values: row.values
	};

	let result: HttpResult<undefined> = {
		success: false,
		code: 500,
		message: 'Unexpected error.'
	};

	const response = await fetch(`${BACKEND_URL}/rows`, {
		method: 'DELETE',
		body: JSON.stringify(payload),
		headers: { 'content-type': 'application/json' }
	});

	result = {
		success: response.ok,
		code: response.status,
		message: response.ok ? `Sucessfully deleted rows.` : await response.text()
	};

	console.log(result.message);

	if (!result.success) {
		error(errorCode(result.code), result.message);
	}

	return json(result);
};
