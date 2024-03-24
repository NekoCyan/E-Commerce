import User from '@/app/models/User';
import { UserData } from '@/app/models/interfaces';
import dbConnect from '@/lib/dbConnect';
import {
	ErrorResponse,
	IsNullOrUndefined,
	RequiredResponse,
	Response,
} from '@/utils';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		await dbConnect();
		const { email, password, fullName } = await req.json();

		if (IsNullOrUndefined(email)) return RequiredResponse('email');
		if (IsNullOrUndefined(password)) return RequiredResponse('password');
		if (IsNullOrUndefined(fullName)) return RequiredResponse('fullName');

		let obj: Partial<UserData> = {
			email: email,
			password: password,
			fullName: fullName,
		};

		const result = await User.createUser(obj);

		return Response({});
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
