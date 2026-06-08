"use client";

import ProtectedRoute from "@/components/shared/ProtectedRoutes";
import Header from "@/components/profile/Header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import About from "@/components/profile/About";
import Posts from "@/components/profile/Posts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Issues from "@/components/profile/Issues";
import AssignedIssues from "@/components/profile/AssignedIssues";
import Reports from "@/components/profile/Reports";
import { useGetUserProfileQuery } from "@/lib/redux/features/users/usersApiSlice";

function ProfilePageContent() {
	const { data: currentUser } = useGetUserProfileQuery();
	const profile = currentUser?.profile;

	const role = profile?.role;
	const hasApartment = Boolean(profile?.apartment);
	const isTenant = role === "tenant";
	const canViewAssignedIssues = role === "repair";
	const canViewReports = role !== "repair" && role !== "agent";

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-8 md:px-6">
			<Header profile={profile} />

			<div className="w-full overflow-hidden rounded-lg border dark:border-eerieBlack">
				<Tabs defaultValue="about">
					<TabsList className="bg-baby_rich flex h-auto min-h-10 w-full flex-wrap justify-start gap-2 p-2">
						<TabsTrigger value="about" className="h3-semibold tab">
							About
						</TabsTrigger>

						<TabsTrigger value="posts" className="h3-semibold tab">
							Posts
						</TabsTrigger>

						<TabsTrigger value="my-issues" className="h3-semibold tab">
							My Issues
						</TabsTrigger>

						{canViewReports && (
							<TabsTrigger value="my-reports" className="h3-semibold tab">
								My Reports
							</TabsTrigger>
						)}

						{canViewAssignedIssues && (
							<TabsTrigger
								value="assigned-issues"
								className="h3-semibold tab"
							>
								Assigned Issues
							</TabsTrigger>
						)}
					</TabsList>

					<About profile={profile} />
					<Posts />
					<Issues />
					{canViewReports && <Reports />}
					{canViewAssignedIssues && <AssignedIssues />}
				</Tabs>
			</div>

			<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
				<Link href="/profile/edit" className="w-full sm:w-auto">
					<Button className="h3-semibold electricIndigo-gradient text-babyPowder w-full rounded-lg sm:w-64">
						Update Profile
					</Button>
				</Link>

				{isTenant && !hasApartment && (
					<Link href="/apartment" className="w-full sm:w-auto">
						<Button className="h3-semibold electricIndigo-gradient text-babyPowder w-full rounded-lg sm:w-64">
							Add Your Apartment
						</Button>
					</Link>
				)}
			</div>
		</div>
	);
}

export default function ProfilePage() {
	return (
		<ProtectedRoute>
			<ProfilePageContent />
		</ProtectedRoute>
	);
}
