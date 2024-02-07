<script lang="ts">
	import { DbRowTable } from '$lib/components/data-tables/rows';
	import { literalSchema } from '$lib/schemas/table.js';
	import { setContext } from 'svelte';
	import z from 'zod';

	export let data;

	let schema = z.object({});

	for (const column of data.columns) {
		schema = schema.extend({
			[column.column_name]: literalSchema
		});
	}

	setContext('form', data.form);
	setContext('schema', schema);
	// NOTE: Pass this as a prop instead if it needs to be a Promise
	setContext('rows', data.rows);
	setContext('columns', data.columns);
</script>

<DbRowTable />
