<script lang="ts">
	import { createTable, Render, Subscribe } from 'svelte-headless-table';
	import { readable } from 'svelte/store';

	import * as Table from '$lib/components/ui/table';
	import { DbRowTableSheet } from '.';
	import { getContext } from 'svelte';

	const data = getContext<Record<string, any>[]>('data');

	$: table = createTable(readable(data));

	$: columnNames = Object.keys(data[0]) || [];

	$: columns = table.createColumns([]);

	$: initColumns = () => {
		columnNames.forEach((col) => {
			const newColumn = table.column({
				accessor: col,
				header: col
			});

			columns.push(newColumn);
		});
	};

	$: initColumns();

	$: ({ headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns));
</script>

<DbRowTableSheet />

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
