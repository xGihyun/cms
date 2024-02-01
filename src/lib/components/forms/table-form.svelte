<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import type { SubmitFunction } from '@sveltejs/kit';

	import { resultMessage } from '$lib/helpers';

	import { tableSchema } from '$lib/schemas/table';
	import { toHttpResult } from '$lib/schemas/result';
	import { tableColumnInfo } from '$lib/schemas/table';

	import type { TableSchema } from '$lib/types/table';
	import type { TableColumnInfo } from '$lib/types/table';
	import type { RequestStatus } from '$lib/types/result';

	import { Footer as SheetFooter } from '$lib/components/ui/sheet';
	import * as Form from '$lib/components/ui/form';
	import { enhance } from '$app/forms';
	import { CheckCircled, CrossCircled } from 'radix-icons-svelte';

	export let form: SuperValidated<TableSchema>;

	let requestStatus: RequestStatus = {
		type: 'none',
		message: 'N/A'
	};

	const createTable: SubmitFunction = () => {
		return async ({ result, update }) => {
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
							await update();

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
		};
	};
</script>

<Form.Root {form} schema={tableSchema} let:config let:attrs>
	<form method="post" action="?/create_table" use:enhance={createTable} {...attrs}>
		<Form.Field {config} name="name">
			<Form.Item>
				<Form.Label>Name</Form.Label>
				<Form.Input required />
				<Form.Validation />
			</Form.Item>
		</Form.Field>

		<SheetFooter>
			<Form.Button>Submit</Form.Button>
		</SheetFooter>
	</form>
</Form.Root>
