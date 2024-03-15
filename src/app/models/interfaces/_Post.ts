import { Document, HydratedDocument, Model } from 'mongoose';
import { DocumentResult } from './ExternalDocument';

export interface PostData {
	title: string;
	content: string;
	author: string;
	createdAt?: Date;
}
export interface IPost extends PostData, DocumentResult<PostData>, Document {}
export interface IPostMethods {}
export interface IPostModel extends Model<IPost, {}, IPostMethods> {}
export type PostHydratedDocument = HydratedDocument<IPost, IPostMethods>;
