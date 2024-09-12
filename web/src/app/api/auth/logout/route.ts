import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const redirectUrl = new URL("/", request.url);

	return NextResponse.redirect(redirectUrl, {
		headers: {
			"set-cookie": "token=; Path=/; max-age=0;",
		},
	});
}
