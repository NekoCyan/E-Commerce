import { Document, HydratedDocument, Model } from 'mongoose';
import { DocumentResult } from './ExternalDocument';

export interface SearchData {
	name: string;
    description: string;
    price: number;
    quantity: number;
	imageUrl: string;
    createdAt: Date;
}
export interface ISearch extends SearchData, DocumentResult<SearchData>, Document {}
export interface ISearchMethods {}
export interface ISearchModel extends Model<ISearch, {}, ISearchMethods> {}
export type SearchHydratedDocument = HydratedDocument<ISearch, ISearchMethods>;
