import { Document, HydratedDocument, Model } from 'mongoose';
import { DocumentResult } from './ExternalDocument';

export interface CategoryData {
	content: string;
	author: string;
	createdAt?: Date;
}
export interface ICategory
	extends CategoryData,
		DocumentResult<CategoryData>,
		Document {}
export interface ICategoryMethods {}
export interface ICategoryModel
	extends Model<ICategory, {}, ICategoryMethods> {}
export type CategoryHydratedDocument = HydratedDocument<
	ICategory,
	ICategoryMethods
>;
