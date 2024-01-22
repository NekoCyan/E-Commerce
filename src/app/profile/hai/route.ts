import { NextResponse, type NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
	return NextResponse.redirect(
		`https://www.facebook.com/profile.php?id=100054243621001`,
	);
}
