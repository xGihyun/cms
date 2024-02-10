<script lang="ts">
	import { readable } from 'svelte/store';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { addSelectedRows, addTableFilter } from 'svelte-headless-table/plugins';

	import type { TableInfo } from '$lib/types/table';

	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import { DbTableCheckbox, DbTableSheet, DbTableActions } from '.';

	export let data: TableInfo[];

	$: table = createTable(readable(data), {
		select: addSelectedRows(),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		})
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
			},
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: ({ name }) => name,
			header: 'Name'
		}),
		table.column({
			accessor: 'column_count',
			header: 'Columns',
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: ({ name }) => name,
			header: '',
			cell: ({ value }) => {
				return createRender(DbTableActions, { tableName: value });
			}
		})
	]);

	$: ({ headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns));
	$: ({ selectedDataIds } = pluginStates.select);
	$: ({ filterValue } = pluginStates.filter);

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

<div class="flex items-center justify-between pb-4">
	<Input class="max-w-sm" placeholder="Filter tables..." type="text" bind:value={$filterValue} />

	<DbTableSheet tables={selectedTables} />
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
									{#if cell.id === 'Name'}
										<a href={`tables/${cell.row.original.name}`} class="hover:underline">
											<Render of={cell.render()} />
										</a>
									{:else if cell.id === ''}
										<div class="text-right">
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

{#if selectedTables.length > 0}
	<div class="mt-4 flex-1 text-sm text-muted-foreground">
		{selectedTables.length} of{' '}
		{$pageRows.length} row(s) selected.
	</div>
{/if}
