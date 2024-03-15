import { Document, Model, HydratedDocument } from 'mongoose';
import { DocumentResult } from './ExternalDocument';
import { IModels } from './';

export interface CommentData {
    content: string;
    author: string;
    createdAt?: Date;
}
export interface IComment
	extends CommentData,
		DocumentResult<CommentData>,
		Document {}
export interface ICommentMethods {}
export interface ICommentModel extends Model<IComment, {}, ICommentMethods> {
}
export type CommentHydratedDocument = HydratedDocument<
	IComment,
	ICommentMethods
>;

