"use client";
import { setAuth, setLogout } from "@/lib/redux/features/auth/authSlice";
import { useAppDispatch } from "@/lib/redux/hooks/typedHooks";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Spinner from "@/components/shared/Spinner";

function AuthLoading() {
	return (
		<div className="flex-center pt-32">
			<Spinner size="xl" />
		</div>
	);
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const isLoggedIn = mounted && getCookie("logged_in") === "true";

	useEffect(() => {
		if (!mounted) {
			return;
		}
		if (isLoggedIn) {
			dispatch(setAuth());
			return;
		}
		dispatch(setLogout());
		router.push("/login");
	}, [dispatch, router, isLoggedIn, mounted]);

	if (!mounted) {
		return <AuthLoading />;
	}

	if (!isLoggedIn) {
		return <AuthLoading />;
	}

	return <>{children}</>;
}

export default ProtectedRoute;
