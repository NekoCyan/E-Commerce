import { Document, Model, HydratedDocument } from 'mongoose';
import { DocumentResult } from './ExternalDocument';
import { IModels } from './';

export interface UserData {
	username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    age?: number;
}
export interface IUser
	extends UserData,
		DocumentResult<UserData>,
		Document {}
export interface IUserMethods {}
export interface IUserModel extends Model<IUser, {}, IUserMethods> {
	
}
export type UserHydratedDocument = HydratedDocument<
	IUser,
	IUserMethods
>;

