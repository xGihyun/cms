import z from 'zod';
import {
	columnSchema,
	editColumnSchema,
	editTableSchema,
	literalSchema,
	tableColumnInfo,
	tableSchema
	// valueSchema
} from '$lib/schemas/table';
import type { ComponentType } from 'svelte';
import type { HTMLInputTypeAttribute } from 'svelte/elements';

export type TableSchema = typeof tableSchema;
export type EditTableSchema = typeof editTableSchema;

export type Literal = z.infer<typeof literalSchema>;
export type Json = Literal | { [key: string]: Json } | Json[];

export type BuildColumn = z.infer<typeof columnSchema>;
export type EditColumn = z.infer<typeof editColumnSchema>;

export type InsertOnColumn = {
	name: string;
	value: Literal;
	is_db_expression: boolean;
};

export type TableInfo = {
	name: string;
	column_count: number;
};

export type TableColumnInfo = z.input<typeof tableColumnInfo>;

export type DBDataTypeValue = {
	description: string;
	alias?: string;
	inputType: HTMLInputTypeAttribute;
	icon?: ComponentType;
	// Functions
	default?: string;
};

export type DBDataType = Map<string, DBDataTypeValue>;
