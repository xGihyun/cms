<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { RequestStatus } from '$lib/types/result';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import { toast } from 'svelte-sonner';
	import { resultMessage } from '$lib/helpers.js';

	export let data;

	let requestStatus: RequestStatus = {
		type: 'none',
		message: 'N/A'
	};
</script>

<form
	action="?/create"
	method="post"
	use:enhance={() => {
		return async ({ result, update }) => {
			requestStatus.type = 'pending';

			console.log(result);

			if (result.type === 'success') {
				await update();

				requestStatus = {
					type: 'success',
					message: resultMessage(result.data.result.message)
				};
			} else if (result.type === 'error') {
				requestStatus = {
					type: 'failure',
					message: resultMessage(result.error.message)
				};

				console.log(requestStatus.message);
			} else {
				requestStatus = {
					type: 'unknown',
					message: 'Unknown status'
				};

				console.log(requestStatus.message);
			}

			toast(requestStatus.message);
		};
	}}
>
	<Button type="submit">New</Button>
</form>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Status</Table.Head>
			<Table.Head>Method</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each data.tables as table (table.name)}
			<Table.Row>
				<Table.Cell>{table.name}</Table.Cell>
				<Table.Cell>{table.column_count}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
