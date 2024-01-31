import { BACKEND_URL } from '$env/static/private';
import { errorCode, toTableInfo } from '$lib/helpers';
import type { TableColumnInfo } from '$lib/types/table';
import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { HttpResult } from '$lib/types/result';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch(`${BACKEND_URL}/tables`, {
		method: 'GET'
	});

	const tableColumns: TableColumnInfo[] = await response.json();

	const tables = toTableInfo(tableColumns);

	return {
		tables
	};
};

const bar = {
	name: 'bar',
	columns: [
		{
			name: 'id',
			data_type: 'uuid',
			default: 'gen_random_uuid()',
			is_nullable: false
		},
		{
			name: 'name',
			data_type: 'text',
			default: 'N/A',
			is_nullable: false
		}
	]
};

export const actions: Actions = {
	create: async ({ fetch }) => {
		const response = await fetch(`${BACKEND_URL}/tables`, {
			method: 'POST',
			body: JSON.stringify(bar),
			headers: {
				'content-type': 'application/json'
			}
		});

		const result: HttpResult<TableColumnInfo[]> = {
			success: response.ok,
			code: response.status,
			data: response.ok ? await response.json() : undefined,
			message: response.ok ? `Sucessfully created table: ${bar.name}` : await response.text()
		};

		if (!result.success) {
			error(errorCode(result.code), result.message);
		}

		return {
			result
		};

		if (!response.ok) {
			return {
				success: false,
				code: response.status,
				message: `Sucessfully created table: ${bar.name}`,
				data: null
			};
		}

		return {
			success: true,
			code: response.status,
			message: `Sucessfully created table: ${bar.name}`,
			data: null
		};
	}
};
