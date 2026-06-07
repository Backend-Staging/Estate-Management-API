"use client";

import { useAppSelector } from "@/lib/redux/hooks/typedHooks";
import { useGetUserQuery } from "@/lib/redux/features/auth/authApiSlice";

export default function AgentDashboardPage() {
	const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
	const { data: user, isLoading } = useGetUserQuery(undefined, {
		skip: !isAuthenticated,
	});

	if (isLoading) {
		return <p className="text-platinum text-sm">Loading account…</p>;
	}

	return (
		<div className="max-w-2xl space-y-4">
			<h1 className="text-2xl font-semibold">Dashboard</h1>
			<p className="text-platinum text-sm">
				Signed in as {user?.full_name} ({user?.email}). Use Django admin or the
				API to manage units and repair staff; UI workflows can be added in Phase
				2.
			</p>
			<ul className="text-platinum list-inside list-disc text-sm">
				<li>API: GET /api/v1/apartments/managed/</li>
				<li>API: POST /api/v1/apartments/add/</li>
				<li>API: POST /api/v1/agents/repair-staff/</li>
			</ul>
		</div>
	);
}
