<script lang="ts">
	import { DbRowTable } from '$lib/components/data-tables/rows';
	import { literalSchema } from '$lib/schemas/table.js';
	import type { Literal, TableColumnInfo } from '$lib/types/table.js';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import z from 'zod';

	export let data;

	let schema = z.object({});

	for (const column of data.columns) {
		schema = schema.extend({
			[column.column_name]:
				column.is_nullable || column.column_default ? literalSchema.optional() : literalSchema
		});
	}

	const columns = writable<TableColumnInfo[]>();
	$: columns.set(data.columns);

	const rows = writable<Record<string, Literal>[]>();
	$: rows.set(data.rows);

	setContext('table', data.table);
	setContext('form', data.form);
	setContext('schema', schema);
	setContext('columns', columns);
	setContext('rows', rows);
</script>

<DbRowTable />
