import { Document, HydratedDocument, Model } from 'mongoose';
import { DocumentList, DocumentResult } from './ExternalDocument';

export interface ProductData {
	productId: number;
	name: string;
	description: string;
	details: string;
	price: number;
	stock: number;
	sold: number;
	isNewProduct: boolean;
	salePercentage: number;
	imageUrls: string[];
	categoryIds: number[];
	status: boolean;
}
export interface IProduct
	extends ProductData,
		DocumentResult<ProductData>,
		Document {}
export interface IProductMethods {}
export interface IProductModel extends Model<IProduct, {}, IProductMethods> {
	isValidProductName(name: string): Promise<boolean>;
	getProduct(productId: number): Promise<ProductData>;
	createProduct(
		data: Omit<
			Partial<ProductData> & Pick<ProductData, 'name'>,
			'productId'
		>,
	): Promise<ProductHydratedDocument>;
	editProduct(
		productId: number,
		data: Omit<Partial<ProductData>, 'productId'>,
	): Promise<ProductData>;
	deleteProduct(productId: number): Promise<ProductData>;
	getProductList(
		limit?: number,
		page?: number,
		filter?: {
			category?: {
				Ids: number[];
				Type: 'AND' | 'OR';
			};
			/**
			 * * -1: All.
			 * * 0: Inactive.
			 * * 1: Active.
			 */
			status?: -1 | 0 | 1;
		},
	): Promise<DocumentList<ProductData>>;
}
export type ProductHydratedDocument = HydratedDocument<
	IProduct,
	IProductMethods
>;
