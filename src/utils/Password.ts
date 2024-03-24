import * as bcrypt from 'bcrypt';

export async function Password_Hash(password: string) {
	let salt: string | number | undefined = process.env.PASSWORD_SALT;
	if (!salt || isNaN(parseInt(salt))) salt = 10;
	else salt = parseInt(salt);

	const saltRounds = await bcrypt.genSalt(salt);

	return bcrypt.hash(password, saltRounds);
}

export async function Password_Compare(
	originalPassword: string,
	hashedPassword: string,
) {
	return bcrypt.compare(originalPassword, hashedPassword);
}
