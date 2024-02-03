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

	import { Footer as SheetFooter, Close as SheetClose } from '$lib/components/ui/sheet';
	import * as Form from '$lib/components/ui/form';
	import { CheckCircled, CrossCircled } from 'radix-icons-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
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
	<div class="p-6">
		<Form.Field {config} name="name">
			<Form.Item>
				<Form.Label>Name</Form.Label>
				<Form.Input required />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	</div>

	<Separator class="my-5" />

	<TableFormColumns />

	<SheetFooter class="p-6">
		<SheetClose asChild let:builder>
			<Button builders={[builder]} type="button" variant="secondary">Cancel</Button>
		</SheetClose>
		<Button type="submit">Save</Button>
	</SheetFooter>
</Form.Root>
