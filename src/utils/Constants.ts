import { CommaAnd, CreateEnum } from './Utilities';

export const ROUTES = {
	// Home.
	Home: '/',
	Auth: '/auth',
	Educational: '/educational',
	// Profile.
	Profile: '/profile',
	Wishlist: '/profile/wishlist',
};

export const HTTPStatusCode = {
	OK: 200,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	CONFLICT: 409,
	GONE: 410,
	UNPROCESSABLE_ENTITY: 422,
	INTERNAL_SERVER_ERROR: 500,
	SERVICE_UNAVAILABLE: 503,
};

export const PATTERN = {
	USERNAME: /[a-zA-Z0-9_.]+/, // DEPRECATED.
	EMAIL: /^[a-zA-Z0-9_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
	PASSWORD: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*[^\x00-\x7F]).{8,}$/,
};

export const ROLES = CreateEnum({
	USER: 0,
	TRAINER: 1,
	ADMIN: 2,
});

export const GENDER = CreateEnum({ UNKNOWN: -1, FEMALE: 0, MALE: 1 });

export const TRANSACTION_STATUS = CreateEnum({
	PENDING: 0,
	SUCCEED: 1,
	FAILED: 2,
	CANCELLED: 3,
});

export const TRANSACTION_TYPE = CreateEnum({
	MEMBERSHIP: 0,
	PRODUCT: 1,
});

export const ResponseText = {
	// API Response.
	InvalidAPIRequest: `Invalid API request.`,

	// System Response.
	Invalid: (variable: string) => {
		return `${variable} is invalid.`;
	},
	InvalidDeduction: (
		variable: string,
		min: number,
		currentNumber: number,
		inputNumber: number,
	) => {
		return `Invalid deduction for ${variable} (Min is ${min}, but given input was ${inputNumber}, while current is ${currentNumber}).`;
	},
	InvalidType: (variable: string, ...allowTypes: string[]) => {
		let errorMessage = `Invalid type of ${variable}`;
		if (allowTypes) {
			errorMessage += ` (Only accept(s) ${CommaAnd(allowTypes)})`;
		}
		errorMessage += '.';

		return errorMessage;
	},
	InvalidPageNumber: (page: number) => {
		return `Invalid page number ${page}.`;
	},
	Min: (variable: string, min: number) => {
		return `${variable} cannot be less than ${min}.`;
	},
	MinOrEqual: (variable: string, min: number) => {
		return `${variable} cannot be less than or equal to ${min}.`;
	},
	Max: (variable: string, max: number) => {
		return `${variable} cannot be more than ${max}.`;
	},
	MaxOrEqual: (variable: string, max: number) => {
		return `${variable} cannot be more than or equal to ${max}.`;
	},
	MinLength: (variable: string, minLength: number) => {
		return `${variable} cannot be less than ${minLength} characters.`;
	},
	MaxLength: (variable: string, maxLength: number) => {
		return `${variable} cannot be more than ${maxLength} characters.`;
	},
	OutOfRange: (variable: string, from: number, to: number) => {
		return `Invalid range of ${variable} (Only accept from ${from} to ${to}).`;
	},
	AlreadyExists: (variable: string) => {
		return `${variable} is already exists.`;
	},
	NotExists: (variable: string) => {
		return `${variable} does not exists.`;
	},
	NotMatch: (variable: string) => {
		return `${variable} does not match.`;
	},
	NotFound: (variable: string) => {
		return `${variable} is not found.`;
	},
	Required: (variable: string) => {
		return `${variable} is required.`;
	},
	TooWeak: (variable: string) => {
		return `${variable} is too weak.`;
	},
	BadRequest: `Bad Request.`,
	NoPermission: `You do not have permission to access this resource.`,
	Unauthorized: `Unauthorized.`,
	InsufficientBalance: `Insufficient balance.`,
	InvalidEmailOrPassword: `Invalid email or password.`,
	DataIsMissing: `Data is missing.`,
};
