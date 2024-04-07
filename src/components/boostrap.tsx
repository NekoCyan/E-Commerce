'use client';

import { MultiStyles } from '@/utils';
import Link from 'next/link';
import { ChangeEvent, FocusEvent, useEffect, useRef, useState } from 'react';

export function TextInput({
	id,
	name,
	type,
	placeholder,
	className,
	value,
	onChange,
	onFocus,
	min,
	max,
}: Readonly<{
	id?: string;
	name?: string;
	type?: 'text' | 'textarea' | 'number';
	placeholder?: string;
	/**
	 * @default {className} 'focus:border-black border-gray-300 border-solid border-2 p-2'
	 */
	className?: string;
	value?: string;
	onChange?: (
		e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
	) => void;
	onFocus?: (
		e: FocusEvent<HTMLInputElement> | FocusEvent<HTMLTextAreaElement>,
	) => void;
	min?: number | string;
	max?: number | string;
}>) {
	if (type === 'textarea') {
		return (
			<textarea
				id={id}
				className={MultiStyles(
					'focus:border-black border-gray-300 border-solid border-2 p-2',
					className ?? '',
				)}
				placeholder={placeholder}
				onFocus={onFocus}
				onChange={onChange}
				value={value}
			/>
		);
	} else {
		return (
			<input
				id={id}
				name={name}
				type={type ?? 'text'}
				className={MultiStyles(
					'focus:border-black border-gray-300 border-solid border-2 p-2',
					className ?? '',
				)}
				placeholder={placeholder}
				onChange={onChange}
				onFocus={onFocus}
				value={value}
				min={min}
				max={max}
			/>
		);
	}
}

export function SearchInput({
	id,
	name,
	placeholder,
	className,
	value,
	onChange,
	onFocus,
	onSearch,
}: Readonly<{
	id?: string;
	name?: string;
	type?: 'text' | 'textarea' | 'number';
	placeholder?: string;
	/**
	 * @default {className} 'flex flex-row gap-3 items-baseline border-solid border-2 focus:border-black border-gray-300 p-2'
	 */
	className?: string;
	value?: string;
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
	onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
	onSearch?: (value: string) => void;
}>) {
	const [searchInput, setSearchInput] = useState(value ?? '');
	const inputRef = useRef<HTMLInputElement>(null);

	const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchInput(e.target.value);
		onChange?.(e);
	};

	useEffect(() => {
		onSearch?.(searchInput);
	}, [searchInput]);

	return (
		<div
			className={MultiStyles(
				'flex flex-row gap-3 items-baseline border-solid border-2 border-gray-300 focus-within:border-black p-2',
				className ?? '',
			)}
		>
			<i className='fa fa-search'></i>
			<input
				ref={inputRef}
				id={id}
				name={name}
				placeholder={placeholder}
				className='focus:outline-none w-full'
				value={searchInput}
				onChange={handleSearchInput}
				onFocus={onFocus}
			/>
			{searchInput && (
				<Link
					href='#'
					className='fa fa-times cursor-pointer text-2xl'
					onClick={(e) => {
						e.preventDefault();
						setSearchInput('');
						if (inputRef.current) {
							inputRef.current.dispatchEvent(
								new Event('input', { bubbles: true }),
							);
						}
					}}
				></Link>
			)}
		</div>
	);
}

export { Alert, Container, SSRProvider, Spinner } from 'react-bootstrap';

