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
 * Logged-in agents are redirected to the agent portal; tenants and repair staff stay here.
 */
export default function EstatePortalGate({
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
		if (!mounted || !isLoggedIn || !isError || !error) {
			return;
		}
		const status = "status" in error ? error.status : null;
		if (isAuthError(status)) {
			clearAuthSession();
			dispatch(setLogout());
			router.replace("/login");
		}
	}, [mounted, isLoggedIn, isError, error, dispatch, router]);

	useEffect(() => {
		if (!mounted || !isLoggedIn || isLoading || !data) {
			return;
		}
		if (role === "agent") {
			router.replace("/agent/dashboard");
		}
	}, [mounted, isLoggedIn, isLoading, data, role, router]);

	if (!mounted) {
		return <GateLoading />;
	}

	if (awaitingProfile) {
		return <GateLoading />;
	}

	if (isLoggedIn && isError && error && "status" in error && isAuthError(error.status)) {
		return <GateLoading />;
	}

	if (isLoggedIn && role === "agent") {
		return null;
	}

	return <>{children}</>;
}
