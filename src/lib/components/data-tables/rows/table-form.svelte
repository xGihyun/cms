<script lang="ts">
	import type { TableColumnInfo } from '$lib/types/table';
	import { getContext } from 'svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { AnyZodObject } from 'zod';

	import * as Form from '$lib/components/ui/form';
	import { Separator } from '$lib/components/ui/separator';
	import { Footer as SheetFooter, Close as SheetClose } from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import { DB_DATA_TYPES } from '$lib';
	import type { ActionResult } from '@sveltejs/kit';
	import type { RequestStatus } from '$lib/types/result';
	import { toHttpResult } from '$lib/schemas/result';
	import { resultMessage } from '$lib/helpers';
	import { CheckCircled, CrossCircled } from 'radix-icons-svelte';
	import { toast } from 'svelte-sonner';
	import { undefined } from 'zod';

	const form = getContext<SuperValidated<AnyZodObject>>('form');
	const schema = getContext<AnyZodObject>('schema');
	const columns = getContext<TableColumnInfo[]>('columns');

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

					console.log(resultSchema);
					console.log(resultData);

					requestStatus = {
						type: result.type,
						message: resultMessage(resultData.message)
					};

					if (result.type === 'success') {
						toast(requestStatus.message, { icon: CheckCircled });

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
	action="?/insert_row&table=test"
	{form}
	{schema}
	options={{
		clearOnSubmit: 'none',
		delayMs: 500,
		onResult: ({ result }) => {
			processResult(result);
		},
		onSubmit: () => {
			toast(`Creating new row...`);
		}
	}}
	let:config
>
	{#each columns as column (column.column_name)}
		<Form.Field {config} name={column.column_name}>
			<Form.Item>
				<Form.Label>{column.column_name}</Form.Label>
				<Form.Description>{column.data_type}</Form.Description>
				<Form.Input
					type={DB_DATA_TYPES.get(column.data_type)?.inputType}
					value={column.is_primary_key ? DB_DATA_TYPES.get(column.data_type)?.default : ''}
				/>
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
