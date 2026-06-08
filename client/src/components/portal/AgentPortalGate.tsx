"use client";

import { setAuth, setLogout } from "@/lib/redux/features/auth/authSlice";
import { useGetUserProfileQuery } from "@/lib/redux/features/users/usersApiSlice";
import { useAppDispatch } from "@/lib/redux/hooks/typedHooks";
import { clearAuthSession } from "@/utils/clearAuthSession";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function GateLoading() {
	return (
		<div className="text-platinum flex min-h-[40vh] items-center justify-center text-sm">
			Loading...
		</div>
	);
}

function isAuthError(status: unknown): boolean {
	return status === 401 || status === 403;
}

/**
 * Agent-only routes. Others go to the main app (or login if anonymous).
 */
export default function AgentPortalGate({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const isLoggedIn = mounted && getCookie("logged_in") === "true";

	useEffect(() => {
		if (isLoggedIn) {
			dispatch(setAuth());
		}
	}, [dispatch, isLoggedIn]);

	const { data, isLoading, isError, error } = useGetUserProfileQuery(undefined, {
		skip: !isLoggedIn,
	});
	const role = data?.profile?.role;
	const awaitingProfile = isLoggedIn && isLoading && !data;

	useEffect(() => {
		if (!mounted) {
			return;
		}
		if (!isLoggedIn) {
			router.replace("/login?next=/agent/dashboard");
			return;
		}
		if (isError && error && "status" in error && isAuthError(error.status)) {
			clearAuthSession();
			dispatch(setLogout());
			router.replace("/login?next=/agent/dashboard");
			return;
		}
		if (isLoading || !data) {
			return;
		}
		if (isError || role !== "agent") {
			router.replace("/welcome");
		}
	}, [mounted, isLoggedIn, isLoading, data, isError, error, role, router, dispatch]);

	if (!mounted) {
		return <GateLoading />;
	}

	if (!isLoggedIn) {
		return null;
	}

	if (awaitingProfile) {
		return <GateLoading />;
	}

	if (isError && error && "status" in error && isAuthError(error.status)) {
		return <GateLoading />;
	}

	if (isError || role !== "agent") {
		return null;
	}

	return <>{children}</>;
}
