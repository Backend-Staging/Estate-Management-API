"use client";

import { useAppSelector } from "@/lib/redux/hooks/typedHooks";
import { useGetUserProfileQuery } from "@/lib/redux/features/users/usersApiSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Agent-only routes. Others go to the main app (or login if anonymous).
 */
export default function AgentPortalGate({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
	const { data: profile, isLoading, isFetching, isError } =
		useGetUserProfileQuery(undefined, { skip: !isAuthenticated });

	useEffect(() => {
		if (!isAuthenticated) {
			router.replace("/login?next=/agent/dashboard");
		}
	}, [isAuthenticated, router]);

	useEffect(() => {
		if (!isAuthenticated || isLoading || isFetching) return;
		if (isError || (profile && profile.role !== "agent")) {
			router.replace("/welcome");
		}
	}, [isAuthenticated, isLoading, isFetching, isError, profile, router]);

	if (!isAuthenticated) {
		return null;
	}
	if (isLoading || isFetching) {
		return (
			<div className="text-platinum flex min-h-[40vh] items-center justify-center text-sm">
				Loading…
			</div>
		);
	}
	if (profile && profile.role !== "agent") {
		return null;
	}
	return <>{children}</>;
}
