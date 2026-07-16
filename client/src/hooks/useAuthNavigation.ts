import {
	staffNavLinks,
	tenantNavLinks,
} from "@/constants/tenant";
import { useLogoutUserMutation } from "@/lib/redux/features/auth/authApiSlice";
import { setLogout } from "@/lib/redux/features/auth/authSlice";
import { useGetUserProfileQuery } from "@/lib/redux/features/users/usersApiSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks/typedHooks";
import { extractErrorMessage } from "@/utils";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AUTH_REQUIRED_PATHS = new Set([
	"/profile",
	"/bookmark",
	"/report-issue",
	"/add-post",
	"/help",
	"/tenants",
	"/technicians",
]);

export function useAuthNavigation() {
	const dispatch = useAppDispatch();
	const [logoutUser] = useLogoutUserMutation();
	const { isAuthenticated } = useAppSelector((state) => state.auth);
	const router = useRouter();

	const { data: profileData } = useGetUserProfileQuery(undefined, {
		skip: !isAuthenticated,
	});
	const role = profileData?.profile?.role;

	const handleLogout = async () => {
		try {
			await logoutUser().unwrap();
			dispatch(setLogout());
			router.push("/login");
			toast.success("Logged Out!");
		} catch (e) {
			const errorMessage = extractErrorMessage(e);
			toast.error(errorMessage || "An error occurred");
		}
	};

	let links = [...tenantNavLinks];

	if (isAuthenticated && (role === "agent" || role === "repair")) {
		links = [...links, ...staffNavLinks];
	}

	const filteredNavLinks = links.filter((link) => {
		if (AUTH_REQUIRED_PATHS.has(link.path)) {
			return isAuthenticated;
		}
		return true;
	});

	return { handleLogout, filteredNavLinks, isAuthenticated };
}
