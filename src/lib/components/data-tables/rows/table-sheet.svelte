<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import { DbRowTableForm } from '.';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import type { Literal, TableColumnInfo } from '$lib/types/table';
	import { CheckCircled, CrossCircled, Trash } from 'radix-icons-svelte';
	import type { HttpResult, RequestStatus } from '$lib/types/result';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	export let selectedRows: Literal[];
	export let primaryKeyInfo: TableColumnInfo | undefined;

	const sheetOpen = writable<boolean>(false);

	setContext('sheetOpen', sheetOpen);

	let requestStatus: RequestStatus = {
		type: 'none',
		message: 'N/A'
	};

	async function deleteRows(): Promise<void> {
		if (!primaryKeyInfo) return;

		requestStatus.type = 'pending';

		const response = await fetch(`/api/rows`, {
			method: 'DELETE',
			body: JSON.stringify({
				primaryKey: primaryKeyInfo,
				values: selectedRows
			}),
			headers: {
				'content-type': 'application/json'
			}
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

{#if selectedRows.length > 0}
	<Button class="flex items-center gap-1" on:click={deleteRows}>
		<Trash />
		Delete
	</Button>
{:else}
	<Sheet.Root bind:open={$sheetOpen}>
		<Sheet.Trigger asChild let:builder>
			<Button builders={[builder]}>New</Button>
		</Sheet.Trigger>
		<Sheet.Content class="w-full p-0 sm:max-w-xl">
			<Sheet.Header class="p-6">
				<Sheet.Title>Create a new row to table</Sheet.Title>
			</Sheet.Header>

			<DbRowTableForm />
		</Sheet.Content>
	</Sheet.Root>
{/if}
