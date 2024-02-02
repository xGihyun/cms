import z from 'zod';

export const valueSchema: z.ZodType<unknown> = z.lazy(
	() => z.string().or(z.number()).or(z.boolean()).or(z.null())
	// .record(z.string(), valueSchema)
	// .or(z.array(valueSchema))
);

export const columnSchema = z
	.object({
		name: z.string(),
		data_type: z.string(),
		default: valueSchema.optional(),
		is_nullable: z.boolean().default(false)
	})
	.required({ name: true, data_type: true });

export const tableSchema = z
	.object({
		name: z.string().max(63),
		columns: columnSchema.array()
	})
	.required({ name: true, columns: true });

export const tableColumnInfo = z.array(
	z.object({
		table_name: z.string(),
		column_name: z.string(),
		data_type: z.string(),
		is_nullable: z.string(),
		character_maximum_length: z.number().nullable()
	})
);
