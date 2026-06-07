"use client";

import { useAppSelector } from "@/lib/redux/hooks/typedHooks";
import { useGetUserProfileQuery } from "@/lib/redux/features/users/usersApiSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Logged-in agents are redirected to the agent portal; tenants and repair staff stay here.
 */
export default function EstatePortalGate({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
	const { data: profile, isLoading, isFetching } = useGetUserProfileQuery(
		undefined,
		{ skip: !isAuthenticated },
	);

	useEffect(() => {
		if (!isAuthenticated || isLoading || isFetching) return;
		if (profile?.role === "agent") {
			router.replace("/agent/dashboard");
		}
	}, [isAuthenticated, isLoading, isFetching, profile?.role, router]);

	if (isAuthenticated && (isLoading || isFetching)) {
		return (
			<div className="text-platinum flex min-h-[40vh] items-center justify-center text-sm">
				Loading…
			</div>
		);
	}
	if (isAuthenticated && profile?.role === "agent") {
		return null;
	}
	return <>{children}</>;
}
