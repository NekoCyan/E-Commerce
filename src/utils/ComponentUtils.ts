export default function MultiStyles(...styles: any[]) {
	return styles.filter((x) => x).join(' ');
}
