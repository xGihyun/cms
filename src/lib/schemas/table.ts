import { DB_DATA_TYPES } from '$lib';
import z from 'zod';

export const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

export const columnSchema = z
	.object({
		name: z.string(),
		data_type: z.string().refine((value) => {
			for (const name of DB_DATA_TYPES.keys()) {
				if (name === value) {
					return true;
				}
			}
			return false;
		}),
		default: literalSchema.optional(),
		is_nullable: z.boolean().default(false),
		is_primary_key: z.boolean().default(false),
		is_unique: z.boolean().default(false)
	})
	.required({ name: true, data_type: true });

export const tableSchema = z
	.object({
		name: z.string().max(63),
		columns: columnSchema.array()
	})
	.required({ name: true, columns: true });

export const tableColumnInfo = z.object({
	table_name: z.string(),
	column_name: z.string(),
	column_default: z.string().optional(),
	data_type: z.string(),
	is_nullable: z.string(),
	character_maximum_length: z.number().nullable(),
	is_primary_key: z.boolean().default(false)
});

export function getSchema(data_type: string) {
	switch (data_type) {
		case 'smallint':
		case 'integer':
		case 'bigint':
		case 'real':
		case 'double precision':
		case 'numeric':
			return z.string();
		case 'text':
		case 'uuid':
			return z.string();
		case 'date':
		case 'time without time zone':
		case 'time with time zone':
		case 'timestamp without time zone':
		case 'timestamp with time zone':
			return z.string();
		case 'boolean':
			return z.boolean();
		default:
			return z.null();
	}
}
