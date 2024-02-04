import { BACKEND_URL } from '$env/static/private';
import { superValidate } from 'sveltekit-superforms/client';
import type { PageServerLoad } from './$types';
import z from 'zod';
import { valueSchema } from '$lib/schemas/table';
import type { TableColumnInfo } from '$lib/types/table';
import type { Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const { name } = params;

	const getTableColumns = async () => {
		const response = await fetch(`${BACKEND_URL}/tables/${name}`, {
			method: 'GET'
		});

		const tableColumnInfo: TableColumnInfo[] = await response.json();

		return tableColumnInfo;
	};

	const response = await fetch(`${BACKEND_URL}/rows?table=${name}`, {
		method: 'GET'
	});

	const rows: Record<string, any>[] = await response.json();

	let schema = z.object({});

	for (const key of Object.keys(rows[0])) {
		schema = schema.extend({
			[key]: valueSchema
		});
	}

	return {
		form: await superValidate(schema),
		rows,
		columns: getTableColumns()
	};
};

export const actions: Actions = {
	insert_row: async (event) => {}
};
