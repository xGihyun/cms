<script lang="ts">
	import { Pencil2 } from 'radix-icons-svelte';

	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import { TableForm } from '$lib/components/forms';
	import { getContext, setContext } from 'svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { TableSchema } from '$lib/types/table';

	export let tableName: string;

	const form = getContext<SuperValidated<TableSchema>>('form');

	setContext('tableName', tableName);
</script>

<Sheet.Root>
	<Sheet.Trigger asChild let:builder>
		<Button
			variant="ghost"
			size="icon"
			class="relative h-8 w-8 p-0"
			builders={[builder]}
			on:click={() => console.log(tableName)}
		>
			<Pencil2 class="h-4 w-4" />
		</Button>
	</Sheet.Trigger>
	<Sheet.Content class="w-full p-0 sm:max-w-2xl">
		<Sheet.Header class="p-6">
			<Sheet.Title>Edit Table</Sheet.Title>
		</Sheet.Header>

		<TableForm {form} mode="edit" />
	</Sheet.Content>
</Sheet.Root>
