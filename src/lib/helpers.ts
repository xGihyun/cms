import type { InsertOnColumn, TableColumnInfo, TableInfo } from '$lib/types/table';
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

export function toColumn(
	data: Record<string, any>,
	tableColumnInfos: TableColumnInfo[]
): InsertOnColumn[] {
	const foo = tableColumnInfos.map((column) => {
		const columnValue = data[column.column_name];

		if (!columnValue && column.column_default) {
			data[column.column_name] = column.column_default;
			return {
				name: column.column_name,
				value: column.column_default,
				is_db_expression: true
			};
		}

		return {
			name: column.column_name,
			value: columnValue,
			is_db_expression: false
		};
	});

	console.log('TO COLUMN FUNCTION');
	console.log(foo);

	return foo;
}

export function getInputType(dataType: string): HTMLInputTypeAttribute {
	switch (dataType) {
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
