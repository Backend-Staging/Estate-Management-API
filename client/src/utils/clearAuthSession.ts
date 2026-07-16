import { deleteCookie } from "cookies-next";

/** Clear client-visible auth cookies when JWT session is invalid or user logs out. */
export function clearAuthSession() {
	deleteCookie("logged_in");
	deleteCookie("access");
	deleteCookie("refresh");
}
