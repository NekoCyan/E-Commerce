import mongoose from 'mongoose';
import { IUser, IUserMethods, IUserModel } from './interfaces';

const UserSchema = new mongoose.Schema<IUser, IUserModel, IUserMethods>({
	username: {
		type: String,
		required: [true, `name is required`],
	},
	email: {
		type: String,
		required: [true, `Email is required`],
	},
	password: {
		type: String,
		required: [true, `password is required`],
	},
	firstName: {
		type: String,
		required: '',
	},
	lastName: {
		type: String,
		required: '',
	},
});

// statics.

const User =
	(mongoose.models.User as IUserModel) ||
	mongoose.model<IUser, IUserModel>('User', UserSchema);

export default User;
