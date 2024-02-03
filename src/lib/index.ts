// place files you want to import through the `$lib` alias in this folder.

import type { DBDataType } from './types/table';

export const dataTypes: DBDataType[] = [
	{
		name: 'int2',
		description: 'Signed two-byte integer (-32,768 to +32,768)'
	},
	{
		name: 'float4',
		description: 'Single precision floating-point number'
	},
	{
		name: 'numeric',
		description: 'Exact numeric of selectable precision'
	},
	{
		name: 'text',
		description: 'Variable-length character string'
	},
	{
		name: 'uuid',
		description: 'Universally unique identifier'
	},
	{
		name: 'date',
		description: 'Calendar date (year, month, day)'
	},
	{
		name: 'time',
		description: 'Time of the day (no timezone)'
	},
	{
		name: 'timetz',
		description: 'Time of the day, including timezone'
	},
	{
		name: 'timestamp',
		description: 'Date and time (no timezone)'
	},
	{
		name: 'timestamptz',
		description: 'Date and time, including timezone'
	},
	{
		name: 'bool',
		description: 'Logical boolean (true/false)'
	}
];
