import { NextResponse } from 'next/server';
import { HTTPStatusCode, ResponseText } from './';

// API Response.
export function InvalidAPIRequestResponse() {
	return ErrorResponse(new Error(ResponseText.InvalidAPIRequest));
}
// System Response.
export function InvalidTypeResponse(variable: string, ...allowTypes: string[]) {
	return ErrorResponse(
		new Error(ResponseText.InvalidType(variable, ...allowTypes)),
	);
}
export function InvalidResponse(variable: string) {
	return ErrorResponse(new Error(ResponseText.Invalid(variable)));
}
export function MinResponse(variable: string, min: number) {
	return ErrorResponse(new Error(ResponseText.Min(variable, min)));
}
export function MaxResponse(variable: string, max: number) {
	return ErrorResponse(new Error(ResponseText.Max(variable, max)));
}
export function MinLengthResponse(variable: string, minLength: number) {
	return ErrorResponse(
		new Error(ResponseText.MinLength(variable, minLength)),
	);
}
export function MaxLengthResponse(variable: string, maxLength: number) {
	return ErrorResponse(
		new Error(ResponseText.MaxLength(variable, maxLength)),
	);
}
export function OutOfRangeResponse(variable: string, from: number, to: number) {
	return ErrorResponse(
		new Error(ResponseText.OutOfRange(variable, from, to)),
	);
}
export function AlreadyExistsResponse(variable: string) {
	return ErrorResponse(new Error(ResponseText.AlreadyExists(variable)));
}
export function NotExistsResponse(variable: string) {
	return ErrorResponse(new Error(ResponseText.NotExists(variable)));
}
export function NotMatchResponse(variable: string) {
	return ErrorResponse(new Error(ResponseText.NotMatch(variable)));
}
export function NotFoundResponse(variable: string) {
	return ErrorResponse(new Error(ResponseText.NotFound(variable)));
}
export function RequiredResponse(variable: string) {
	return ErrorResponse(new Error(ResponseText.Required(variable)));
}
export function BadRequestResponse() {
	return ErrorResponse(new Error(ResponseText.BadRequest));
}
export function NoPermissionResponse() {
	return ErrorResponse(new Error(ResponseText.NoPermission));
}
export function UnauthorizedResponse() {
	return ErrorResponse(new Error(ResponseText.Unauthorized));
}
// Custom Response.
export function CategoriesValidationFailedResponse() {
	return ErrorResponse(new Error(ResponseText.CategoriesValidationFailed));
}
export function SomethingWentWrongResponse() {
	return ErrorResponse(new Error(ResponseText.SomethingWentWrong));
}

export function Response<T extends { [key: string]: any }>(
	data: T = {} as T,
	status: number = 200,
) {
	if (typeof data !== 'object')
		throw new Error(
			'Parameter data must be an Object, please contact Admin for more informations.',
		);
	if (typeof status !== 'number')
		throw new Error(
			'Parameter status must be a Number, please contact Admin for more informations.',
		);

	type OmitMessage<T> = 'message' extends keyof T ? Omit<T, 'message'> : T;

	let message = 'OK';
	if ('message' in data) {
		message = data.message;
		delete data.message;
	}

	let obj: {
		message: string;
		code: number;
		success: boolean;
		data: OmitMessage<T>;
	} = {
		message,
		code: status,
		success: status >= 200 && status < 300,
		data: data as OmitMessage<T>,
	};

	return NextResponse.json(obj, {
		status,
		headers: {
			'Content-Type': 'application/json',
		},
	});
}

export function ErrorResponse(
	err: NextResponse | Error | string,
	data?: { [key: string]: any },
) {
	if (err instanceof NextResponse) return err;
	if (typeof err === 'string') err = new Error(err);

	let statusCode;
	let responseMessage = '';

	// since we can't use mongoose types here, do test with object.
	// if (err instanceof mongoose.Error.ValidationError) {
	// 	const errors = err.errors;
	// 	const obj = Object.keys(errors);

	// 	if (errors[obj[0]] instanceof mongoose.Error.ValidatorError) {
	// 		responseMessage =
	// 			// @ts-ignore
	// 			errors[obj[0]].properties?.message ?? errors[obj[0]].message;
	// 	}
	// } else {
	// 	responseMessage = err.message;
	// }
	// Refactor from the above code in below.
	const tryMongooseError = (err as any).errors;
	if (tryMongooseError) {
		const mongoErrorObj = Object.keys(tryMongooseError);
		// Do try with ValidatorError.
		if (tryMongooseError[mongoErrorObj[0]]) {
			responseMessage =
				tryMongooseError[mongoErrorObj[0]]?.properties?.message ??
				tryMongooseError[mongoErrorObj[0]]?.message ??
				'';
		}
	}

	if (responseMessage === '') responseMessage = err.message;

	const resLower = responseMessage.toLowerCase();
	if (resLower.includes('unauthorized'))
		statusCode = HTTPStatusCode.UNAUTHORIZED;
	else if (
		['forbidden', 'not have permission', 'no permission'].some((x) =>
			resLower.includes(x.toLowerCase()),
		)
	)
		statusCode = HTTPStatusCode.FORBIDDEN;
	else if (resLower.includes('not found'))
		statusCode = HTTPStatusCode.NOT_FOUND;
	else if (resLower.includes('already exists'))
		statusCode = HTTPStatusCode.CONFLICT;
	else if (
		['expired', 'out of stock', 'not enough'].some((x) =>
			resLower.includes(x.toLowerCase()),
		)
	)
		statusCode = HTTPStatusCode.GONE;
	else if (
		['less than', 'greater than', 'range of'].some((x) =>
			resLower.includes(x.toLowerCase()),
		)
	)
		statusCode = HTTPStatusCode.UNPROCESSABLE_ENTITY;
	else if (
		['service', 'unavailable'].every((x) =>
			resLower.includes(x.toLowerCase()),
		)
	)
		statusCode = HTTPStatusCode.SERVICE_UNAVAILABLE;
	else statusCode = HTTPStatusCode.BAD_REQUEST;

	return Response(
		{
			message: responseMessage ?? 'Unknown error.',
			...data,
		},
		statusCode,
	);
}
