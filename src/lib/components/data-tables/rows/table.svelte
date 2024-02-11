<script lang="ts">
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { addSelectedRows } from 'svelte-headless-table/plugins';
	import { readable, type Writable } from 'svelte/store';
	import { getContext } from 'svelte';

	import * as Table from '$lib/components/ui/table';
	import { DbRowTableSheet, DbRowTableCheckbox } from '.';
	import type { Literal, TableColumnInfo } from '$lib/types/table';

	const tableColumnInfos = getContext<Writable<TableColumnInfo[]>>('columns');
	const rows = getContext<Writable<Record<string, Literal>[]>>('rows');

	$: table = createTable(readable($rows), {
		select: addSelectedRows()
	});

	$: columns = table.createColumns([]);

	$: initColumns = () => {
		$tableColumnInfos.forEach((col) => {
			if (col.is_primary_key) {
				const newColumn = table.column({
					accessor: `${col.column_name} checkbox`,
					header: (_, { pluginStates }) => {
						const { allPageRowsSelected } = pluginStates.select;
						return createRender(DbRowTableCheckbox, {
							checked: allPageRowsSelected
						});
					},
					cell: ({ row }, { pluginStates }) => {
						const { getRowState } = pluginStates.select;
						const { isSelected } = getRowState(row);

						return createRender(DbRowTableCheckbox, {
							checked: isSelected
						});
					}
				});

				columns.push(newColumn);
			}

			const newColumn = table.column({
				accessor: col.column_name,
				header: col.is_primary_key ? `${col.column_name} (Primary Key)` : col.column_name
			});

			columns.push(newColumn);
		});
	};

	$: initColumns();

	$: primaryKeyInfo = $tableColumnInfos.find((column) => column.is_primary_key);
	$: selectedRows = [] as Literal[]; // Primary keys

	$: addSelectedEntries = () => {
		if (!$selectedDataIds) return;

		const indices: string[] = Object.keys($selectedDataIds) || [];

		selectedRows = indices.map((idx) => {
			const i = Number(idx);

			if (!primaryKeyInfo || !$rows[i]) return null;

			return $rows[i][primaryKeyInfo.column_name];
		});
	};

	$: addSelectedEntries();

	$: ({ headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns));
	$: ({ selectedDataIds } = pluginStates.select);
</script>

<div class="flex items-center justify-between pb-4">
	<DbRowTableSheet {selectedRows} {primaryKeyInfo} />
</div>

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
									{#if !cell.value}
										<div class="text-muted-foreground">
											<Render of={cell.render()} />
										</div>
									{:else}
										<Render of={cell.render()} />
									{/if}
								</Table.Cell>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Body>
	</Table.Root>
</div>

{#if selectedRows.length > 0}
	<div class="mt-4 flex-1 text-sm text-muted-foreground">
		{selectedRows.length} of{' '}
		{$pageRows.length} row(s) selected.
	</div>
{/if}
