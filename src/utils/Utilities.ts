import { DateTimeInput } from '@/types';
import ms from 'ms';

export function EncodeBase64(str: string, depth: number = 1) {
	if (!str || depth <= 0) return str;

	return EncodeBase64(btoa(str), depth - 1);
}

export function DecodeBase64(str: string, depth: number = 1) {
	if (!str || depth <= 0) return str;

	try {
		return DecodeBase64(atob(str), depth - 1);
	} catch (e) {
		return str;
	}
}

export function Capitalize(str: string) {
	if (!str || typeof str !== 'string') return str;

	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function IsNullOrUndefined(variable: any): boolean {
	return variable === null || variable === undefined;
}

export function IsDecimal(value: any): boolean {
	return !isNaN(value) && value % 1 !== 0;
}

export function CreateEnum<T extends { [key: string]: number }>(
	objects: T,
): Readonly<
	T & { [key: number]: keyof T } & {
		__LENGTH: number;
		__MIN: number | undefined;
		__MAX: number | undefined;
	}
> {
	let obj: any = {};

	let count = 0;
	let min: number | undefined;
	let max: number | undefined;

	const keys = Object.keys(objects);
	if (keys.length > 0) {
		const values = Object.values(objects).sort((a, b) => a - b);
		min = values[0];
		max = values[values.length - 1];

		for (const [key, value] of Object.entries(objects)) {
			if (value === null) continue;
			obj[key] = value;
			obj[value] = key;

			count++;
		}
	}

	obj['__MIN'] = min;
	obj['__MAX'] = max;
	obj['__LENGTH'] = count;
	return Object.freeze(obj);
}

export function FormatShortDateTime(date: DateTimeInput) {
	if (!date) return '';
	date = new Date(date);

	let result = [];

	let year = date.getFullYear(); // getFullYear() returns the year (four digits for dates between year 1000 and 9999) of the specified date.
	let month = date.getMonth() + 1; // getMonth() is zero-based
	let day = date.getDate(); // getDate() returns the day of the month (from 1 to 31) for the specified date.

	let hours = date.getHours(); // getHours() returns the hour (from 0 to 23) of the specified date and time.
	let minutes = date.getMinutes(); // getMinutes() returns the minutes (from 0 to 59) of the specified date and time.
	let seconds = date.getSeconds(); // getSeconds() returns the seconds (from 0 to 59) of the specified date and time.

	const _0 = PadZero;

	let tt = hours >= 12 ? 'PM' : 'AM'; // AM and PM

	hours = hours % 12;
	hours = hours || 12; // the hour '0' should be '12'

	result.push(`${_0(day)}/${_0(month)}/${year}`);
	result.push(`${_0(hours)}:${_0(minutes)}:${_0(seconds)}`);
	result.push(tt);

	return result.join(' ');
}

// Open AI made this e.e
export function FormatFullDateTime(
	date: Date | string | number,
	long: boolean = false,
): string {
	if (!date) return '';
	date = new Date(date);
	const timestamp = date.getTime();

	const second = 1000;
	const minute = 60 * second;
	const hour = 60 * minute;
	const day = 24 * hour;
	const month = 30 * day;
	const year = 365 * day;

	const years = Math.floor(timestamp / year);
	const months = Math.floor((timestamp % year) / month);
	const days = Math.floor(((timestamp % year) % month) / day);
	const hours = Math.floor((((timestamp % year) % month) % day) / hour);
	const minutes = Math.floor(
		((((timestamp % year) % month) % day) % hour) / minute,
	);
	const seconds = Math.floor(
		(((((timestamp % year) % month) % day) % hour) % minute) / second,
	);

	const plural = (num: number, str: string) => (num > 1 ? `${str}s` : str);
	const formatTime = (time: number, unit: string) =>
		`${time} ${plural(time, unit)}`;

	let timeString = '';

	if (long) {
		timeString += formatTime(years, 'year');
		timeString += ` ${formatTime(months, 'month')}`;
		timeString += ` ${formatTime(days, 'day')}`;
		timeString += ` ${formatTime(hours, 'hour')}`;
		timeString += ` ${PadZero(minutes)} ${plural(minutes, 'minute')}`;
		timeString += ` ${PadZero(seconds)} ${plural(seconds, 'second')}`;
	} else {
		if (years > 0) timeString += formatTime(years, 'year');
		if (months > 0) timeString += ` ${formatTime(months, 'month')}`;
		if (days > 0) timeString += ` ${formatTime(days, 'day')}`;
		if (hours > 0) timeString += ` ${formatTime(hours, 'hour')}`;
		if (minutes > 0)
			timeString += ` ${PadZero(minutes)} ${plural(minutes, 'minute')}`;
		if (seconds > 0)
			timeString += ` ${PadZero(seconds)} ${plural(seconds, 'second')}`;
	}

	return timeString.trim();
}

export function PadZero(number: number) {
	return number < 10 ? `0${number}` : number;
}

export function SearchParamsToObject<T extends { [key: string]: string }>(
	searchParams: URLSearchParams,
): Partial<T> {
	const obj: any = {};

	for (const [key, value] of searchParams.entries()) {
		obj[key] = value;
	}

	return obj;
}

export function MS<T extends boolean = false>(
	data: string | number,
	toLongString: T = false as T,
): T extends true ? string : number {
	let output: any;

	if (typeof data == 'string') {
		if (!ms(data)) throw new Error(`Invalid time string ${data}.`);
		output = ms(data);
	} else if (typeof data == 'number') {
		output = data;
	} else
		throw new Error(
			`Invalid data type ${typeof data} that was given in data.`,
		);

	if (toLongString) {
		output = ms(output, { long: true });
	}

	return output;
}

export function CommaAnd(
	args: string[],
	Prefix: string = '',
	Postfix: string = '',
): string {
	let arr = Array.from(args);
	if (arr.length == 0) return '';
	const Fix = (text: string) => Prefix + text + Postfix;

	let text = '';
	if (arr.length >= 2) {
		let pop = arr.pop();

		text = arr.map((x) => Fix(x)).join(', ') + ' and ' + Fix(pop!);
	} else {
		text = Fix(arr[0]);
	}
	return text;
}

export function DateToTimestamp(date: Date | string | number) {
	return new Date(date).getTime();
}

export function Currency(data: number) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format(data);
}

export function RandomNumber(min: number, max: number) {
	// Create byte array and fill with 1 random number
	var byteArray = new Uint8Array(1);
	crypto.getRandomValues(byteArray);

	var range = max - min + 1;
	var max_range = 256;
	if (byteArray[0] >= Math.floor(max_range / range) * range)
		return RandomNumber(min, max);
	return min + (byteArray[0] % range);
}

export function RandomDecimal() {
	let byteArray = new Uint32Array(1);
	crypto.getRandomValues(byteArray);

	return byteArray[0] / (0xffffffff + 1);
}

export function LimitArray<T>(array: T[], limit: number) {
	if (array.length <= limit) return array;
	return array.slice(0, limit);
}

export function ShuffleArray<T>(array: T[]) {
	return array.sort(() => RandomDecimal() - 0.5);
}

export function Truncate(str: string, length: number, suffix: string = '...') {
	if (str.length <= length) return str;
	return str.substring(0, length - suffix.length) + suffix;
}
