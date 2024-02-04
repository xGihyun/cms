<script lang="ts">
	import type { TableColumnInfo } from '$lib/types/table';
	import { getContext } from 'svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { AnyZodObject } from 'zod';

	import * as Form from '$lib/components/ui/form';
	import { Separator } from '$lib/components/ui/separator';
	import { Footer as SheetFooter, Close as SheetClose } from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';

	const form = getContext<SuperValidated<AnyZodObject>>('form');
	const schema = getContext<AnyZodObject>('schema');
	const getColumns = getContext<Promise<TableColumnInfo[]>>('columns');
</script>

{#await getColumns}
	Loading...
{:then columns}
	<Form.Root method="POST" {form} {schema} let:config>
		{#each columns as column (column.column_name)}
			<Form.Field {config} name={column.column_name}>
				<Form.Item>
					<Form.Label>{column.column_name}</Form.Label>
					<Form.Input />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
		{/each}

		<SheetFooter class="p-6">
			<SheetClose asChild let:builder>
				<Button builders={[builder]} type="button" variant="secondary">Cancel</Button>
			</SheetClose>
			<Form.Button>Save</Form.Button>
		</SheetFooter>
	</Form.Root>
{/await}
