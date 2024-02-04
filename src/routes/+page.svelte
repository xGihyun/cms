<script lang="ts">
	import { DbTable } from '$lib/components/data-tables/dbtable';
	import { setContext } from 'svelte';

	export let data;

	setContext('form', data.form);
</script>

<DbTable data={data.tables} />

<!-- <Table.Root> -->
<!-- 	<Table.Header> -->
<!-- 		<Table.Row> -->
<!-- 			<Table.Head>Name</Table.Head> -->
<!-- 			<Table.Head>Columns</Table.Head> -->
<!-- 		</Table.Row> -->
<!-- 	</Table.Header> -->
<!-- 	<Table.Body> -->
<!-- 		{#each data.tables as table (table.name)} -->
<!-- 			<Table.Row> -->
<!-- 				<Table.Cell>{table.name}</Table.Cell> -->
<!-- 				<Table.Cell>{table.column_count}</Table.Cell> -->
<!-- 			</Table.Row> -->
<!---->
<!-- 			<Button on:click={() => deleteTable(table.name)}>Delete</Button> -->
<!-- 		{/each} -->
<!-- 	</Table.Body> -->
<!-- </Table.Root> -->
