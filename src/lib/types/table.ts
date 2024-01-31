export type TableInfo = {
	name: string;
	column_count: number;
};

export type TableColumnInfo = {
	table_name: string;
	column_name: string;
	data_type: string;
	is_nullable: string;
	character_maximum_length?: number;
};

export type ColumnInfo = {
	column_name: string;
	data_type: string;
	is_nullable: string;
	character_maximum_length?: number;
};
