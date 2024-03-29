<script lang="ts">
	import { getForm } from 'formsnap';
	import { toast } from 'svelte-sonner';

	import type { BuildColumn, EditColumn, EditTableSchema, TableColumnInfo } from '$lib/types/table';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Cross2 } from 'radix-icons-svelte';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Select from '$lib/components/ui/select';
	import { DB_DATA_TYPES } from '$lib';
	import type { Selected } from 'bits-ui';
	import { getContext } from 'svelte';

	const { form, submitting, delayed, errors, constraints } = getForm<EditTableSchema>();

	export let mode: 'new' | 'edit';
	export let tableColumnInfos: TableColumnInfo[] = [];

	const tableName = getContext<string | undefined>('tableName');

	$: if ($submitting && $delayed && !$errors) {
		toast(`Creating table: ${$form.name}`);
	}

	interface SelectedWithState<T> extends Selected<T> {
		state: 'added' | 'removed' | 'unchanged' | 'modified';
	}

	let selectedDataType: SelectedWithState<string | undefined>[] = [];

	if (mode === 'edit') {
		$form.name = tableName || '';

		tableColumnInfos.forEach(
			({ column_name, data_type, is_nullable, is_primary_key, column_default }) => {
				$form.columns.push({
					is_unique: is_primary_key ? true : false,
					is_primary_key: is_primary_key || false,
					is_nullable: is_nullable === 'NO' ? false : true,
					data_type,
					name: column_name,
					default: column_default,
					state: 'unchanged'
				});

				selectedDataType.push({ value: data_type, label: data_type, state: 'unchanged' });
			}
		);
	} else {
		$form.columns = [
			{
				name: 'id',
				data_type: 'uuid',
				is_nullable: false,
				is_primary_key: true,
				is_unique: true,
				default: DB_DATA_TYPES.get('uuid')?.default,
				state: 'added'
			},
			{
				name: 'created_at',
				data_type: 'timestamp without time zone',
				is_nullable: false,
				is_primary_key: false,
				is_unique: false,
				default: DB_DATA_TYPES.get('timestamp without time zone')?.default,
				state: 'added'
			}
		] satisfies EditColumn[];

		selectedDataType = [
			{
				value: $form.columns[0].data_type,
				label: $form.columns[0].data_type,
				state: $form.columns[0].state
			},
			{
				value: $form.columns[1].data_type,
				label: $form.columns[1].data_type,
				state: $form.columns[1].state
			}
		];
	}

	function addColumn(): void {
		const newColumn: EditColumn = {
			name: '',
			data_type: '---',
			is_nullable: false,
			is_primary_key: false,
			is_unique: false,
			state: 'added'
		};

		form.update(($form) => {
			$form.columns.push(newColumn);

			return $form;
		});

		selectedDataType.push({ value: undefined, state: 'added' });
	}

	function deleteColumn(idx: number): void {
		form.update(($form) => {
			const column = $form.columns[idx];

			if (column.state === 'unchanged') {
				column.state = 'removed';
				// selectedDataType[idx].state = 'removed';

				if (idx < selectedDataType.length - 1) {
					selectedDataType[idx].value = selectedDataType[idx + 1].value;
					selectedDataType[idx].label = selectedDataType[idx + 1].label;
				}
			} else {
				$form.columns.splice(idx, 1);
				selectedDataType.splice(idx, 1);
			}

			return $form;
		});
	}

	$: selectDataType = (
		selected: Selected<string | undefined> | undefined,
		column: BuildColumn,
		idx: number
	): void => {
		column.data_type = selected?.value || '---';

		form.update(($form) => {
			if (!selected?.value) return $form;

			$form.columns[idx].default = DB_DATA_TYPES.get(selected.value)?.default;

			return $form;
		});
	};
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
			{#if column.state !== 'removed'}
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
							onSelectedChange={(selected) => selectDataType(selected, column, idx)}
						>
							<Select.Trigger class={error?.data_type ? 'border-destructive/75' : ''}>
								<Select.Value asChild placeholder="---" let:label>
									<span>
										{DB_DATA_TYPES.get(label)?.alias ? DB_DATA_TYPES.get(label)?.alias : label}
									</span>
								</Select.Value>
							</Select.Trigger>
							<Select.Content sameWidth={false}>
								{#each DB_DATA_TYPES as [key, value] (key)}
									{@const label = value.alias ? value.alias : key}

									<Select.Item value={key} {label}>
										{label}
										<span class="ml-4 text-muted-foreground/75">{value.description}</span>
									</Select.Item>
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

					<Button variant="ghost" size="icon" on:click={() => deleteColumn(idx)}>
						<Cross2 />
					</Button>
				</div>
			{/if}
		{/each}
	</div>

	<div class="mt-6">
		<Button variant="secondary" size="sm" on:click={addColumn}>New Column</Button>
	</div>
</div>
