import z from 'zod';

export const tableSchema = z.object({
	name: z.string().max(63)
});

export const tableColumnInfo = z.array(
	z.object({
		table_name: z.string(),
		column_name: z.string(),
		data_type: z.string(),
		is_nullable: z.string(),
		character_maximum_length: z.number().nullable()
	})
);
