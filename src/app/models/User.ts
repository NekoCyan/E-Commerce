import { PATTERN, ResponseText } from '@/utils';
import { Password_Compare, Password_Hash } from '@/utils/Password';
import mongoose from 'mongoose';
import Counter from './Counter';
import { IUser, IUserMethods, IUserModel } from './interfaces';

const UserSchema = new mongoose.Schema<IUser, IUserModel, IUserMethods>(
	{
		userId: {
			type: Number,
			unique: true,
		},
		email: {
			type: String,
			required: [true, ResponseText.Required('email')],
			match: [PATTERN.EMAIL, ResponseText.Invalid('email')],
		},
		password: {
			type: String,
			required: [true, ResponseText.Required('password')],
			minlength: [6, ResponseText.MinLength('password', 6)],
		},
		fullName: {
			type: String,
			required: [true, ResponseText.Required('fullName')],
		},
		phone: {
			type: String,
			default: '',
		},
		address: {
			type: String,
			default: '',
		},
		dob: {
			type: Date,
			default: new Date(0),
		},
		avatar: {
			type: String,
			default: '',
		},
		role: {
			type: String,
			default: 'USER',
		},
		keySession: {
			type: String,
			default: '',
		},
	},
	{
		timestamps: true,
	},
);

// methods.
UserSchema.method('generateKeySession', function (): ReturnType<
	IUserMethods['generateKeySession']
> {
	return Buffer.from(Date.now().toString()).toString('hex');
});
UserSchema.method('comparePassword', async function (password: string): Promise<
	ReturnType<IUserMethods['comparePassword']>
> {
	return Password_Compare(password, this.password);
});

// statics.
UserSchema.static(
	'findUserByCredentials',
	async function (
		email: string,
		password: string,
	): Promise<ReturnType<IUserModel['findUserByCredentials']>> {
		const user = await this.findOne({ email: email.toLowerCase() });
		if (!user) throw new Error(ResponseText.InvalidEmailOrPassword);
		const isMatch = await user.comparePassword(password);
		if (!isMatch) throw new Error(ResponseText.InvalidEmailOrPassword);

		let returnObj = {
			userId: user.userId,
			email: user.email,
			fullName: user.fullName,
			phone: user.phone,
			address: user.address,
			dob: user.dob,
			avatar: user.avatar,
			role: user.role,
			keySession: user.keySession,
		};

		return returnObj;
	},
);
UserSchema.static('createUser', async function (data: Partial<IUser>): Promise<
	ReturnType<IUserModel['createUser']>
> {
	if ([data.email, data.password, data.fullName].some((x) => !x))
		throw new Error(ResponseText.DataIsMissing);
	if (await this.exists({ email: data.email }))
		throw new Error(ResponseText.AlreadyExists('email'));

	return this.create({
		email: data.email,
		password: data.password,
		fullName: data.fullName,
	});
});
UserSchema.static(
	'isValidKeySession',
	async function (
		userId: number,
		keySession: string,
	): Promise<ReturnType<IUserModel['isValidKeySession']>> {
		return !!(await this.exists({ userId, keySession }));
	},
);
UserSchema.static('isAdmin', async function (userId: number): Promise<
	ReturnType<IUserModel['isAdmin']>
> {
	return !!(await this.exists({ userId, role: 'ADMIN' }));
});

// middleware.
UserSchema.pre('save', async function (next): Promise<void> {
	const hashPass = async () => {
		this.password = await Password_Hash(this.password);
	};

	if (this.isNew) {
		this.userId = await Counter.getNextSequence(User, 'userId');
	}

	if (this.isModified('password')) await hashPass();
	if (this.isModified('email')) this.email = this.email.toLowerCase();

	if (this.isModified('password') || this.isModified('email')) {
		this.keySession = this.generateKeySession();
	}

	next();
});
UserSchema.pre('validate', function (next): void {
	const passwordLower = this.password.toLowerCase();
	const emailLower = this.email.toLowerCase();
	if (
		[
			emailLower.includes(passwordLower),
			passwordLower.includes(emailLower),
		].some((x) => x === true)
	)
		throw new Error(ResponseText.TooWeak('Password'));

	next();
});

const User =
	(mongoose.models.User as IUserModel) ||
	mongoose.model<IUser, IUserModel>('User', UserSchema);

export default User;
