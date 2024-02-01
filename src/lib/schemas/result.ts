import z from 'zod';

export const httpResult = z.object({
	success: z.boolean(),
	code: z.number(),
	message: z.string(),
	data: z.unknown().optional()
});

export function toHttpResult<T>(data: z.ZodType<T>) {
	return z.object({
		success: z.boolean(),
		code: z.number(),
		message: z.string(),
		data: data.optional()
	});
}
