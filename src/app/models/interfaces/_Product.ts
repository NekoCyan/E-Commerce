import { Document, HydratedDocument, Model } from 'mongoose';
import { DocumentResult } from './ExternalDocument';

export interface ProductData {
	name: string;
	description?: string;
	price: number;
	image?: string;
}
export interface IProduct
	extends ProductData,
		DocumentResult<ProductData>,
		Document {}
export interface IProductMethods {}
export interface IProductModel extends Model<IProduct, {}, IProductMethods> {}
export type ProductHydratedDocument = HydratedDocument<
	IProduct,
	IProductMethods
>;
