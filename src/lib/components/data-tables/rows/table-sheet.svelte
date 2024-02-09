<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import { DbRowTableForm } from '.';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	const sheetOpen = writable<boolean>(false);

	setContext('sheetOpen', sheetOpen);
</script>

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
