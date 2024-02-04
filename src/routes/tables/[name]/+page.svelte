<script lang="ts">
	import { DbRowTable } from '$lib/components/data-tables/rows';
	import { valueSchema } from '$lib/schemas/table.js';
	import { setContext } from 'svelte';
	import z from 'zod';

	export let data;

	let schema = z.object({});

	for (const key of Object.keys(data.rows[0])) {
		schema = schema.extend({
			[key]: valueSchema
		});
	}

	setContext('form', data.form);
	setContext('schema', schema);
	setContext('data', data.rows);
	setContext('columns', data.columns);
</script>

<DbRowTable />
