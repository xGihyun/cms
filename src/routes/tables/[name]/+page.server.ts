import { BACKEND_URL } from '$env/static/private';
import { superValidate } from 'sveltekit-superforms/client';
import type { PageServerLoad } from './$types';
import z from 'zod';
import { literalSchema } from '$lib/schemas/table';
import type { Json, TableColumnInfo } from '$lib/types/table';
import { fail, type Actions } from '@sveltejs/kit';
import type { HttpResult } from '$lib/types/result';
import { toColumn } from '$lib/helpers';

let schema = z.object({});
let tableColumnInfos: TableColumnInfo[] = [];

export const load: PageServerLoad = async ({ fetch, params }) => {
	const { name } = params;

	const response = await fetch(`${BACKEND_URL}/tables/${name}`, {
		method: 'GET'
	});

	tableColumnInfos = [];
	tableColumnInfos = await response.json();

	schema = z.object({});

	for (const column of tableColumnInfos) {
		schema = schema.extend({
			[column.column_name]:
				column.is_nullable === 'YES' || column.column_default
					? literalSchema.optional()
					: literalSchema
		});
	}

	const getRows = async (): Promise<Record<string, any>[]> => {
		const response = await fetch(`${BACKEND_URL}/rows?table=${name}`, {
			method: 'GET'
		});

		const rows: Record<string, any>[] = await response.json();

		return rows;
	};

	return {
		form: await superValidate(schema),
		rows: await getRows(),
		columns: tableColumnInfos,
		table: name
	};
};

export const actions: Actions = {
	insert_row: async (event) => {
		const form = await superValidate(event, schema);

		const table = event.url.searchParams.get('table');

		let result: HttpResult<Json> = {
			success: false,
			code: 500,
			message: 'Unexpected error.'
		};

		if (!form.valid) {
			result.message = 'Invalid form data.';
			result.code = 400;

			return fail(result.code, {
				form,
				result
			});
		}

		if (!table) {
			result.message = 'Table not found.';
			result.code = 404;

			return fail(result.code, {
				form,
				result
			});
		}

		const rowsToInsert = {
			table,
			columns: toColumn(form.data, tableColumnInfos)
		};

		const response = await event.fetch(`${BACKEND_URL}/rows`, {
			method: 'POST',
			body: JSON.stringify(rowsToInsert),
			headers: {
				'content-type': 'application/json'
			}
		});

		result = {
			success: response.ok,
			code: response.status,
			// data: response.ok ? await response.text() : undefined,
			message: response.ok ? `Sucessfully created new row for ${table}` : await response.text()
		};

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
	}
};
