<script lang="ts">
	import { getForm } from 'formsnap';
	import { toast } from 'svelte-sonner';

	import type { Column, TableSchema } from '$lib/types/table';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Cross2 } from 'radix-icons-svelte';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Select from '$lib/components/ui/select';
	import { dataTypes } from '$lib';

	const { form, submitting, delayed, errors, constraints } = getForm<TableSchema>();

	$: if ($submitting && $delayed && !$errors) {
		toast(`Creating table: ${$form.name}`);
	}

	$form.columns = [
		{
			name: 'id',
			data_type: 'uuid',
			is_nullable: false,
			is_primary_key: true,
			is_unique: true,
			default: 'gen_random_uuid()'
		},
		{
			name: 'created_at',
			data_type: 'timestamp',
			is_nullable: false,
			is_primary_key: false,
			is_unique: false,
			default: 'now()'
		}
	];

	let selectedDataType: { value: string; label?: string }[] = [
		{
			value: $form.columns[0].data_type,
			label: $form.columns[0].data_type
		},
		{
			value: $form.columns[1].data_type,
			label: $form.columns[1].data_type
		}
	];

	function addColumn(): void {
		const newColumn: Column = {
			name: '',
			data_type: '---',
			is_nullable: false,
			is_primary_key: false,
			is_unique: false
		};

		form.update(($form) => {
			$form.columns.push(newColumn);

			return $form;
		});

		selectedDataType.push({ value: '---', label: '---' });
	}

	function deleteColumn(index: number): void {
		form.update(($form) => {
			$form.columns.splice(index, 1);

			return $form;
		});

		selectedDataType.splice(index, 1);
	}
</script>

<div class="p-6">
	<h2 class="mb-6 text-lg font-semibold">Columns</h2>

	<div class="space-y-2">
		<div class="grid grid-cols-9 items-center gap-2">
			<Label class="col-span-2 text-sm text-muted-foreground">Name</Label>
			<Label class="col-span-2 text-sm text-muted-foreground">Type</Label>
			<Label class="col-span-2 text-sm text-muted-foreground">Default Value</Label>
			<Label class="col-span-1 text-sm text-muted-foreground">Primary</Label>
		</div>

		{#each $form.columns as column, idx (idx)}
			{@const error = $errors?.columns?.[idx]}

			<div class="grid grid-cols-9 items-center gap-2">
				<div class="col-span-2 space-y-2">
					<Input bind:value={column.name} {...$constraints.columns?.name} />
					{#if error?.name}
						<p class="text-[0.8rem] font-medium text-destructive">
							{error?.name}
						</p>
					{/if}
				</div>

				<div class="col-span-2 space-y-2">
					<input bind:value={column.data_type} {...$constraints.columns?.data_type} hidden />

					<Select.Root
						{...$constraints.columns?.data_type}
						required
						bind:selected={selectedDataType[idx]}
						onSelectedChange={(selected) => (column.data_type = selected?.value || '---')}
					>
						<Select.Trigger class={error?.data_type ? 'border-destructive/75' : ''}>
							<Select.Value />
						</Select.Trigger>
						<Select.Content sameWidth={false}>
							{#each dataTypes as dataType (dataType.name)}
								<Select.Item value={dataType.name}>{dataType.name}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<div class="col-span-2 space-y-2">
					<Input
						bind:value={column.default}
						{...$constraints.columns?.default}
						placeholder="NULL"
					/>
					{#if error?.default}
						<p class="text-[0.8rem] font-medium text-destructive">
							{error?.default}
						</p>
					{/if}
				</div>

				<Checkbox bind:checked={column.is_primary_key} />

				<Button variant="ghost" on:click={() => deleteColumn(idx)}>
					<Cross2 />
				</Button>
			</div>
		{/each}
	</div>

	<div class="mt-6">
		<Button variant="secondary" size="sm" on:click={addColumn}>New Column</Button>
	</div>
</div>
