export interface DocumentResult<T> {
	_doc: T;
}

export type DocumentList<T> = {
	list: T[];
	currentPage: number;
	totalPage: number;
};