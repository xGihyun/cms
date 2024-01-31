import type { TableColumnInfo, TableInfo } from '$lib/types/table';
import type { NumericRange } from '@sveltejs/kit';

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
