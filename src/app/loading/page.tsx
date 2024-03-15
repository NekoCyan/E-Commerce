import { setTimeout } from 'timers/promises';

export default async function LoadingForTest() {
	await setTimeout(10 * 1000);

	return <div>Hello world!</div>;
}
