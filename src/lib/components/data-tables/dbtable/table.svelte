<script lang="ts">
	import { readable } from 'svelte/store';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { addSelectedRows } from 'svelte-headless-table/plugins';

	import type { TableInfo } from '$lib/types/table';

	import * as Table from '$lib/components/ui/table';
	import { DbTableCheckbox, DbTableSheet } from '.';

	export let data: TableInfo[];

	$: table = createTable(readable(data), {
		select: addSelectedRows()
	});

	$: columns = table.createColumns([
		table.column({
			accessor: 'name',
			header: (_, { pluginStates }) => {
				const { allPageRowsSelected } = pluginStates.select;
				return createRender(DbTableCheckbox, {
					checked: allPageRowsSelected
				});
			},
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);

				return createRender(DbTableCheckbox, {
					checked: isSelected
				});
			}
		}),
		table.column({
			accessor: ({ name }) => name,
			header: 'Name'
		}),
		table.column({
			accessor: 'column_count',
			header: 'Columns'
		})
	]);

	$: ({ headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns));
	$: ({ selectedDataIds } = pluginStates.select);

	$: selectedTables = [] as string[];

	$: addSelectedTables = () => {
		if (!$selectedDataIds) return;

		const indices: string[] = Object.keys($selectedDataIds) || [];

		selectedTables = indices.map((idx) => {
			const i = Number(idx);

			return data[i].name;
		});
	};

	$: addSelectedTables();
</script>

<DbTableSheet tables={selectedTables} />

<div class="rounded-md border">
	<Table.Root {...$tableAttrs}>
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
								<Table.Head {...attrs}>
									<Render of={cell.render()} />
								</Table.Head>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Header>
		<Table.Body {...$tableBodyAttrs}>
			{#each $pageRows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<Table.Row {...rowAttrs}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<Table.Cell {...attrs}>
									<Render of={cell.render()} />
								</Table.Cell>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Body>
	</Table.Root>
</div>

<div class="mt-4 flex-1 text-sm text-muted-foreground">
	{selectedTables.length} of{' '}
	{$pageRows.length} row(s) selected.
</div>
