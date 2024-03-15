import { Document, Model, HydratedDocument } from 'mongoose';
import { DocumentResult } from './ExternalDocument';
import { IModels } from './';

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
export interface IProductModel extends Model<IProduct, {}, IProductMethods> {
}
export type ProductHydratedDocument = HydratedDocument<
	IProduct,
	IProductMethods
>;

