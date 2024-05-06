import { ErrorResponse, Response } from '@/utils';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		return Response({ message: 'Hello World!' });
	} catch (e: any) {
		return ErrorResponse(e);
	}
}

export async function POST(req: NextRequest) {
	try {
		return Response({ message: 'Hello World!' });
	} catch (e: any) {
		return ErrorResponse(e);
	}
}

export async function PUT(req: NextRequest) {
	try {
		return Response({ message: 'Hello World!' });
	} catch (e: any) {
		return ErrorResponse(e);
	}
}

export async function DELETE(req: NextRequest) {
	try {
		return Response({ message: 'Hello World!' });
	} catch (e: any) {
		return ErrorResponse(e);
	}
}

export async function PATCH(req: NextRequest) {
	try {
		return Response({ message: 'Hello World!' });
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
