<script lang="ts">
	import { DbRowTable } from '$lib/components/data-tables/rows';
	import { literalSchema } from '$lib/schemas/table.js';
	import { setContext } from 'svelte';
	import z from 'zod';

	export let data;

	let schema = z.object({});

	for (const column of data.columns) {
		schema = schema.extend({
			[column.column_name]:
				column.is_nullable || column.column_default ? literalSchema.optional() : literalSchema
		});
	}

	setContext('table', data.table);
	setContext('form', data.form);
	setContext('schema', schema);
	setContext('columns', data.columns);
</script>

<DbRowTable rows={data.rows} />
