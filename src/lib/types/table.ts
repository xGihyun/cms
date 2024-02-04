import z from 'zod';
import { columnSchema, tableColumnInfo, tableSchema, valueSchema } from '$lib/schemas/table';
import type { ComponentType } from 'svelte';

export type TableSchema = typeof tableSchema;
export type ValueSchema = typeof valueSchema;

export type Column = z.infer<typeof columnSchema>;

export type TableInfo = {
	name: string;
	column_count: number;
};

export type TableColumnInfo = z.infer<typeof tableColumnInfo>;

export type ColumnInfo = {
	column_name: string;
	data_type: string;
	is_nullable: string;
	character_maximum_length?: number;
};

export type PGDataType = {
	name: string;
	description: string;
	icon?: ComponentType;
};
