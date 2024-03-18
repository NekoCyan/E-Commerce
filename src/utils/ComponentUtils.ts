export function MultiStyles(...styles: any[]) {
	return styles.filter((x) => x).join(' ');
}

export function FormatCurrency(
	price: number,
	prefix: string = '$',
	suffix: string = '',
) {
	return prefix + `${price.toFixed(2)}` + suffix;
}
