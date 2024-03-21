type PageProps<
	T extends { [key: string]: string } = {},
	U extends URLSearchParams = URLSearchParams,
> = {
	params: T;
	searchParams: U;
};
