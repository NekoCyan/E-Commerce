import { Document, HydratedDocument, Model } from 'mongoose';
import { DocumentResult } from './ExternalDocument';

export interface ProductData {
	name: string;
    description: string;
    price: number;
    quantity: number;
	imageUrl: string;
    createdAt: Date;
}
export interface IProduct extends ProductData, DocumentResult<ProductData>, Document {}
export interface IProductMethods {}
export interface IProductModel extends Model<IProduct, {}, IProductMethods> {}
export type ProductHydratedDocument = HydratedDocument<IProduct, IProductMethods>;
