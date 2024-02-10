<script lang="ts">
	import { DbTable } from '$lib/components/data-tables/dbtable';
	import { setContext } from 'svelte';

	export let data;

	setContext('form', data.form);
</script>

<DbTable data={data.tables} />
