<script lang="ts">
	import { getForm } from 'formsnap';
	import { toast } from 'svelte-sonner';

	import type { Column, TableSchema } from '$lib/types/table';
	import Input from '../ui/input/input.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Plus } from 'radix-icons-svelte';

	const { form, delayed } = getForm<TableSchema>();

	$: if ($delayed) {
		toast('Creating table...');
	}

	const newColumn: Column = {
		name: '',
		data_type: '',
		is_nullable: false
	};

	$form.columns = [
		{
			name: 'id',
			data_type: 'uuid',
			is_nullable: false
		},
		{
			name: 'created_at',
			data_type: 'timestamp',
			is_nullable: false
		},
		newColumn
	];

	function addColumn() {
		form.update(($form) => {
			$form.columns.push(newColumn);

			return $form;
		});
	}
</script>

{#each $form.columns as _, idx}
	<div>
		<!-- <Label>Column Name</Label> -->
		<Input bind:value={$form.columns[idx].name} />

		<!-- <Label>Data Type</Label> -->
		<Input bind:value={$form.columns[idx].data_type} />
	</div>
{/each}

<Button on:click={addColumn}>
	<Plus />
</Button>
