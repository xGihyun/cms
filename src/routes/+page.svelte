<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import { TableForm } from '$lib/components/forms';

	export let data;
</script>

<Sheet.Root>
	<Sheet.Trigger asChild let:builder>
		<Button builders={[builder]}>New</Button>
	</Sheet.Trigger>
	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>New Table</Sheet.Title>
			<Sheet.Description>Description here</Sheet.Description>
		</Sheet.Header>

		<TableForm form={data.form} />
	</Sheet.Content>
</Sheet.Root>

<!-- <form action="?/insert_row" method="post" use:enhance={insertRow}> -->
<!-- 	<Button type="submit">New Row</Button> -->
<!-- </form> -->

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Status</Table.Head>
			<Table.Head>Method</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each data.tables as table (table.name)}
			<Table.Row>
				<Table.Cell>{table.name}</Table.Cell>
				<Table.Cell>{table.column_count}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
