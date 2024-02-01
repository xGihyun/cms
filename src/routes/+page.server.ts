import { BACKEND_URL } from '$env/static/private';
import { toTableInfo } from '$lib/helpers';
import type { TableColumnInfo } from '$lib/types/table';
import { type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { HttpResult } from '$lib/types/result';
import { superValidate } from 'sveltekit-superforms/client';
import { tableSchema } from '$lib/schemas/table';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch(`${BACKEND_URL}/tables`, {
		method: 'GET'
	});

	const tableColumns: TableColumnInfo[] = await response.json();

	const tables = toTableInfo(tableColumns);

	return {
		form: await superValidate(tableSchema),
		tables
	};
};

const dummyTable = {
	name: 'foo',
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

const newRow = {
	table: 'foo',
	columns: [
		{
			name: 'name',
			value: 'Hello, World!'
		}
	]
};

export const actions: Actions = {
	create_table: async (event) => {
		const form = await superValidate(event, tableSchema);

		let result: HttpResult<TableColumnInfo[]> = {
			success: false,
			code: 500,
			message: 'Unexpected error.'
		};

		if (!form.valid) {
			result.message = 'Invalid form data.';
			result.code = 400;

			return fail(400, {
				form,
				result
			});
		}

		dummyTable.name = form.data.name;

		console.log(dummyTable);

		const response = await event.fetch(`${BACKEND_URL}/tables`, {
			method: 'POST',
			body: JSON.stringify(dummyTable),
			headers: {
				'content-type': 'application/json'
			}
		});

		result = {
			success: response.ok,
			code: response.status,
			data: response.ok ? await response.json() : undefined,
			message: response.ok ? `Sucessfully created table: ${dummyTable.name}` : await response.text()
		};

		console.log(result.message);

		if (!result.success) {
			return fail(result.code, {
				form,
				result
			});
		}

		return {
			form,
			result
		};
	},
	insert_row: async ({ fetch }) => {
		const response = await fetch(`${BACKEND_URL}/rows`, {
			method: 'POST',
			body: JSON.stringify(newRow),
			headers: {
				'content-type': 'application/json'
			}
		});

		const result: HttpResult<TableColumnInfo[]> = {
			success: response.ok,
			code: response.status,
			data: response.ok ? await response.json() : undefined,
			message: response.ok ? `Sucessfully created row on ${newRow.table}` : await response.text()
		};

		console.log(result);

		if (!result.success) {
			return fail(result.code, {
				result
			});
		}

		return {
			result
		};
	}
};
