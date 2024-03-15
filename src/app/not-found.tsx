import Link from "next/link";

export default function NotFound() {
	return (
		<div>
			<h1>Not Found!</h1>
			<p>Sorry, the resources does not exist</p>
			<Link href='/'>Back to Home</Link>
		</div>
	);
}
