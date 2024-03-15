export default async function NekoPage() {
	await new Promise((resolve) => setTimeout(resolve, 3000));

	return <div>Ehe ~</div>;
}
