import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface Decoded {
	user: User;
}
interface User {
	sub: string;
	name: string;
	avatarUrl: string;
}

export function getUser(): User {
	const token = cookies().get("token")?.value;

	if (!token) {
		throw new Error("Unauthenticated.");
	}

	const decoded: Decoded = jwtDecode(token);

	return decoded.user;
}
