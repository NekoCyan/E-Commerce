import { Document, Model, HydratedDocument } from 'mongoose';
import { DocumentResult } from './ExternalDocument';
import { IModels } from './';

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
export interface ICategoryModel extends Model<ICategory, {}, ICategoryMethods> {
}
export type CategoryHydratedDocument = HydratedDocument<
	ICategory,
	ICategoryMethods
>;

