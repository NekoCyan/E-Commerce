import { Document, Model, HydratedDocument } from 'mongoose';
import { DocumentResult } from './ExternalDocument';
import { IModels } from './';

export interface PostData {
    title: string;
    content: string;
    author: string;
    createdAt?: Date;
}
export interface IPost
	extends PostData,
		DocumentResult<PostData>,
		Document {}
export interface IPostMethods {}
export interface IPostModel extends Model<IPost, {}, IPostMethods> {
}
export type PostHydratedDocument = HydratedDocument<
	IPost,
	IPostMethods
>;

