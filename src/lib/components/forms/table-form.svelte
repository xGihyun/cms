<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import type { ActionResult } from '@sveltejs/kit';

	import { resultMessage } from '$lib/helpers';

	import { tableSchema } from '$lib/schemas/table';
	import { toHttpResult } from '$lib/schemas/result';
	import { tableColumnInfo } from '$lib/schemas/table';

	import type { TableSchema } from '$lib/types/table';
	import type { TableColumnInfo } from '$lib/types/table';
	import type { RequestStatus } from '$lib/types/result';

	import { Footer as SheetFooter } from '$lib/components/ui/sheet';
	import * as Form from '$lib/components/ui/form';
	import { CheckCircled, CrossCircled } from 'radix-icons-svelte';
	import { Button } from '$lib/components/ui/button';
	import TableFormColumns from './table-form-columns.svelte';

	export let form: SuperValidated<TableSchema>;

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
					const resultSchema = toHttpResult<TableColumnInfo>(tableColumnInfo);
					const resultData = resultSchema.parse(result.data?.result);

					requestStatus = {
						type: result.type,
						message: resultMessage(resultData.message)
					};

					if (result.type === 'success') {
						toast(requestStatus.message, { icon: CheckCircled });
						// await update();

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
	action="?/create_table"
	{form}
	schema={tableSchema}
	options={{
		dataType: 'json',
		clearOnSubmit: 'none',
		delayMs: 500,
		onResult: ({ result }) => {
			processResult(result);
		}
	}}
	let:config
>
	<Form.Field {config} name="name">
		<Form.Item>
			<Form.Label>Name</Form.Label>
			<Form.Input required />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<TableFormColumns />

	<SheetFooter>
		<Button type="submit">Submit</Button>
	</SheetFooter>
</Form.Root>

<!-- <form method="POST" action="?/create_table" use:enhance> -->
<!-- 	{#each $bar.columns as _, i} -->
<!-- 		<div> -->
<!-- 			Column Name -->
<!-- 			<Input bind:value={$bar.columns[i].name} /> -->
<!-- 			Data Type -->
<!-- 			<Input bind:value={$bar.columns[i].data_type} /> -->
<!-- 		</div> -->
<!-- 	{/each} -->
<!-- 	<button>Submit</button> -->
<!-- </form> -->
