import { ROLES } from '@/types';
import { Document, HydratedDocument, Model } from 'mongoose';
import { DocumentResult } from './ExternalDocument';

export interface UserData {
	userId: number;
	email: string;
	password: string;
	fullName: string;
	phone: string;
	address: string;
	dob: Date;
	avatar: string;
	role: ROLES;
	/**
	 * This is the key for authorize the user session.
	 */
	keySession: string;
}
export interface IUser extends UserData, DocumentResult<UserData>, Document {}
export interface IUserMethods {
	generateKeySession: () => string;
	comparePassword: (password: string) => Promise<boolean>;
}
export interface IUserModel extends Model<IUser, {}, IUserMethods> {
	findUserByCredentials: (
		email: string,
		password: string,
	) => Promise<UserDataOmitPassword>;
	createUser: (data: Partial<UserData>) => Promise<UserHydratedDocument>;
	isValidKeySession: (userId: number, keySession: string) => Promise<boolean>;
	isAdmin: (userId: number) => Promise<boolean>;
}
export type UserDataOmitPassword = Omit<UserData, 'password'>;
export type UserHydratedDocument = HydratedDocument<IUser, IUserMethods>;
