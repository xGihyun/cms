<script lang="ts">
	import type { TableColumnInfo } from '$lib/types/table';
	import { getContext } from 'svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { AnyZodObject } from 'zod';

	import * as Form from '$lib/components/ui/form';
	import { Separator } from '$lib/components/ui/separator';
	import { Footer as SheetFooter, Close as SheetClose } from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import type { ActionResult } from '@sveltejs/kit';
	import type { RequestStatus } from '$lib/types/result';
	import { toHttpResult } from '$lib/schemas/result';
	import { resultMessage } from '$lib/helpers';
	import { CheckCircled, CrossCircled } from 'radix-icons-svelte';
	import { toast } from 'svelte-sonner';
	import { undefined } from 'zod';
	import type { Writable } from 'svelte/store';

	const form = getContext<SuperValidated<AnyZodObject>>('form');
	const schema = getContext<AnyZodObject>('schema');
	const columns = getContext<Writable<TableColumnInfo[]>>('columns');
	const currentTable = getContext<string>('table');
	const sheetOpen = getContext<Writable<boolean>>('sheetOpen');

	let requestStatus: RequestStatus = {
		type: 'none',
		message: 'N/A'
	};

	function processResult(result: ActionResult<Record<string, any>, Record<string, any>>) {
		requestStatus.type = 'pending';

		switch (result.type) {
			case 'success':
			case 'failure':
				{
					const resultSchema = toHttpResult<undefined>(undefined());
					const resultData = resultSchema.parse(result.data?.result);

					console.log(resultData);

					requestStatus = {
						type: result.type,
						message: resultMessage(resultData.message)
					};

					if (result.type === 'success') {
						toast(requestStatus.message, { icon: CheckCircled });
						$sheetOpen = false;

						return;
					}
				}

				break;
			case 'error':
				requestStatus = {
					type: 'failure',
					message: resultMessage(result.error.message)
				};

				break;
			default:
				requestStatus = {
					type: 'unknown',
					message: 'Unknown request status.'
				};

				break;
		}

		toast(requestStatus.message, { icon: CrossCircled });
	}
</script>

<Form.Root
	method="POST"
	action={`?/insert_row&table=${currentTable}`}
	{form}
	{schema}
	options={{
		dataType: 'form',
		clearOnSubmit: 'none',
		delayMs: 500,
		onSubmit: () => {
			toast(`Creating new row...`);
		},
		onResult: ({ result }) => {
			processResult(result);
		}
	}}
	let:config
>
	<div class="p-6">
		{#each $columns as column (column.column_name)}
			{@const required = column.is_nullable === 'YES' || column.column_default ? false : true}

			<Form.Field {config} name={column.column_name}>
				<Form.Item class="grid grid-cols-3">
					<div class="col-span-1">
						<Form.Label>{column.column_name}</Form.Label>
						<Form.Description>{column.data_type}</Form.Description>
					</div>
					{#if column.data_type === 'text'}
						<Form.Textarea
							class="col-span-2 h-28"
							placeholder={column.column_default ? `Default: ${column.column_default}` : null}
							{required}
						/>
					{:else}
						<Form.Input
							class="col-span-2"
							type="text"
							placeholder={column.column_default ? `Default: ${column.column_default}` : null}
							{required}
						/>
					{/if}
					<Form.Validation />
				</Form.Item>
			</Form.Field>
		{/each}
	</div>

	<SheetFooter class="p-6">
		<SheetClose asChild let:builder>
			<Button builders={[builder]} type="button" variant="secondary">Cancel</Button>
		</SheetClose>
		<Form.Button>Save</Form.Button>
	</SheetFooter>
</Form.Root>
