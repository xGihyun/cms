// place files you want to import through the `$lib` alias in this folder.

import type { DBDataType } from './types/table';

export const DB_DATA_TYPES: DBDataType = new Map([
	[
		'smallint',
		{
			alias: 'int2',
			description: 'Signed two-byte integer',
			inputType: 'text'
		}
	],
	[
		'integer',
		{
			alias: 'int4',
			description: 'Signed four-byte integer',
			inputType: 'text'
		}
	],
	[
		'bigint',
		{
			alias: 'int8',
			description: 'Signed eight-byte integer',
			inputType: 'text'
		}
	],
	[
		'real',
		{
			alias: 'float4',
			description: 'Single precision floating-point number',
			inputType: 'text'
		}
	],
	[
		'numeric',
		{
			alias: 'decimal',
			description: 'Exact numeric of selectable precision',
			inputType: 'text'
		}
	],
	[
		'text',
		{
			description: 'Variable-length character string',
			inputType: 'text'
		}
	],
	[
		'uuid',
		{
			description: 'Universally unique identifier',
			inputType: 'text',
			default: 'gen_random_uuid()'
		}
	],
	[
		'date',
		{
			description: 'Calendar date (year, month, day)',
			inputType: 'text'
		}
	],
	[
		'time without time zone',
		{
			alias: 'time',
			description: 'Time of the day (no timezone)',
			inputType: 'text',
			default: 'now()'
		}
	],
	[
		'time with time zone',
		{
			alias: 'timetz',
			description: 'Time of the day, including timezone',
			inputType: 'text',
			default: 'now()'
		}
	],
	[
		'timestamp without time zone',
		{
			alias: 'timestamp',
			description: 'Date and time (no timezone)',
			inputType: 'text',
			default: 'now()'
		}
	],
	[
		'timestamp with time zone',
		{
			alias: 'timestamptz',
			description: 'Date and time, including timezone',
			inputType: 'text',
			default: 'now()'
		}
	],
	[
		'boolean',
		{
			alias: 'bool',
			description: 'Logical boolean (true/false)',
			inputType: 'text'
		}
	]
]);
