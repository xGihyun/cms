<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import { TableForm } from '$lib/components/forms';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import type { HttpResult, RequestStatus } from '$lib/types/result.js';
	import { CheckCircled, CrossCircled } from 'radix-icons-svelte';

	export let data;

	let requestStatus: RequestStatus = {
		type: 'none',
		message: 'N/A'
	};

	async function deleteTable(name: string): Promise<void> {
		requestStatus.type = 'pending';

		const response = await fetch(`/api/tables?name=${name}`, {
			method: 'DELETE'
		});

		const result: HttpResult<undefined> = await response.json();

		console.log(result);

		if (response.ok) {
			requestStatus = {
				type: 'success',
				message: result.message
			};

			toast(result.message, { icon: CheckCircled });
			await invalidateAll();

			return;
		}

		requestStatus = {
			type: 'failure',
			message: result.message
		};

		toast(result.message, { icon: CrossCircled });
	}
</script>

<Sheet.Root>
	<Sheet.Trigger asChild let:builder>
		<Button builders={[builder]}>New</Button>
	</Sheet.Trigger>
	<Sheet.Content class="w-full p-0 sm:max-w-xl">
		<Sheet.Header class="p-6">
			<Sheet.Title>Create a New Table</Sheet.Title>
			<!-- <Sheet.Description>Description here</Sheet.Description> -->
		</Sheet.Header>

		<TableForm form={data.form} />
	</Sheet.Content>
</Sheet.Root>

<!-- <form action="?/insert_row" method="post" use:enhance={insertRow}> -->
<!-- 	<Button type="submit">New Row</Button> -->
<!-- </form> -->

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Name</Table.Head>
			<Table.Head>Columns</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each data.tables as table (table.name)}
			<Table.Row>
				<Table.Cell>{table.name}</Table.Cell>
				<Table.Cell>{table.column_count}</Table.Cell>
			</Table.Row>

			<Button on:click={() => deleteTable(table.name)}>Delete</Button>
		{/each}
	</Table.Body>
</Table.Root>
