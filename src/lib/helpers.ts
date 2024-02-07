import type { TableColumnInfo, TableInfo } from '$lib/types/table';
import type { NumericRange } from '@sveltejs/kit';
import type { HTMLInputTypeAttribute } from 'svelte/elements';

export function toTableInfo(tableColumns: TableColumnInfo[]): TableInfo[] {
	const tableMap = new Map<string, TableInfo>();

	tableColumns.forEach(({ table_name }) => {
		if (tableMap.has(table_name)) {
			const tableInfo = tableMap.get(table_name);
			if (tableInfo) {
				tableInfo.column_count += 1;
			}
		} else {
			tableMap.set(table_name, { name: table_name, column_count: 1 });
		}
	});

	return Array.from(tableMap.values());
}

export function errorCode(num: number): NumericRange<400, 599> {
	if (num >= 400 && num <= 599) {
		return num as NumericRange<400, 599>;
	}

	return 500;
}

export function resultMessage(message: string | undefined): string {
	if (!message) {
		return 'Result message not found.';
	}

	return message;
}

export function toColumn(obj: Record<string, any>) {
	return Object.entries(obj).map(([key, value]) => ({ name: key, value }));
}

export function getInputType(data_type: string): HTMLInputTypeAttribute {
	switch (data_type) {
		case 'smallint':
		case 'integer':
		case 'bigint':
		case 'real':
		case 'double precision':
		case 'numeric':
			return 'number';
		case 'text':
		case 'uuid':
		case 'boolean':
			return 'text';
		case 'date':
		case 'timestamp without time zone':
		case 'timestamp with time zone':
			return 'date';
		case 'time without time zone':
		case 'time with time zone':
			return 'time';
		default:
			return 'text';
	}
}
