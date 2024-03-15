import mongoose from 'mongoose';
import {
	IUser,
	IUserMethods,
	IUserModel,
	IModels,
} from './interfaces';

const UserSchema = new mongoose.Schema<
	IUser,
	IUserModel,
	IUserMethods
>({
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
		required:" ",
	},
	lastName: {
		type: String,
		required: " ",
	},
	
});

// statics.
UserSchema.static(
	'getNextSequence',
	async function (
		modelName: IModels | string,
		fieldName: string,
	): Promise<number> {
		if (typeof modelName === 'function') modelName = modelName.modelName;

		const User: IUser = await this.findOneAndUpdate(
			{ name: `${modelName}.${fieldName}` },
			{ $inc: { seq: 1 } },
			{ new: true, upsert: true },
		);

		return User.seq;
	},
);

const User =
	(mongoose.models.User as IUserModel) ||
	mongoose.model<IUser, IUserModel>('User', UserSchema);

export default User;
