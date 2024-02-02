import z from 'zod';
import { columnSchema, tableColumnInfo, tableSchema } from '$lib/schemas/table';

export type TableSchema = typeof tableSchema;

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
