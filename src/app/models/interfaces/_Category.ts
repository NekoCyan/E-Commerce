import { Document, HydratedDocument, Model } from 'mongoose';
import { DocumentList, DocumentResult } from './ExternalDocument';

export interface CategoryData {
	categoryId: number;
	name: string;
	description: string;
}
export interface ICategory
	extends CategoryData,
		DocumentResult<CategoryData>,
		Document {}
export interface ICategoryMethods {}
export interface ICategoryModel extends Model<ICategory, {}, ICategoryMethods> {
	isValidCategoryName(name: string): Promise<boolean>;
	getCategory(categoryId: number): Promise<CategoryData>;
	createCategory(
		data: Omit<
			Partial<CategoryData> & Pick<CategoryData, 'name'>,
			'categoryId'
		>,
	): Promise<CategoryHydratedDocument>;
	editCategory(
		categoryId: number,
		data: Omit<Partial<CategoryData>, 'categoryId'>,
	): Promise<CategoryData>;
	deleteCategory(categoryId: number): Promise<CategoryData>;
	getCategoryList(
		limit?: number,
		page?: number,
	): Promise<DocumentList<CategoryData>>;
}
export type CategoryHydratedDocument = HydratedDocument<
	ICategory,
	ICategoryMethods
>;
