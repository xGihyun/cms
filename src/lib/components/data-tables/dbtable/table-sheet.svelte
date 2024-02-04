<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import { TableForm } from '$lib/components/forms';

	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import type { HttpResult, RequestStatus } from '$lib/types/result.js';
	import { CheckCircled, CrossCircled } from 'radix-icons-svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { TableSchema } from '$lib/types/table';
	import { getContext } from 'svelte';

	export let tables: string[];

	const form = getContext<SuperValidated<TableSchema>>('form');

	let requestStatus: RequestStatus = {
		type: 'none',
		message: 'N/A'
	};

	async function deleteTable(): Promise<void> {
		requestStatus.type = 'pending';

		const response = await fetch(`/api/tables?names=${tables}`, {
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

{#if tables.length > 0}
	<Button on:click={deleteTable}>Delete</Button>
{:else}
	<Sheet.Root>
		<Sheet.Trigger asChild let:builder>
			<Button builders={[builder]}>New</Button>
		</Sheet.Trigger>
		<Sheet.Content class="w-full p-0 sm:max-w-xl">
			<Sheet.Header class="p-6">
				<Sheet.Title>Create a New Table</Sheet.Title>
			</Sheet.Header>

			<TableForm {form} />
		</Sheet.Content>
	</Sheet.Root>
{/if}
