import { setTimeout } from "timers/promises";

export default async function LoadingForTest() {
    await setTimeout(30 * 60 * 1000);
    
	return <div>Hello world!</div>;
}
