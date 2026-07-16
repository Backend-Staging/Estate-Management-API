"use client";

import {
	useDeleteIssueMutation,
	useGetSingleIssueQuery,
} from "@/lib/redux/features/issues/issueApiSlice";
import { extractErrorMessage } from "@/utils";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import MaintenanceTriagePanel from "@/components/ai/MaintenanceTriagePanel";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { AuthFormHeader } from "../forms/auth";
import { CheckCheck, CircleDot, EyeIcon, Hotel } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface IssueDetailsProps {
	params: {
		id: string;
	};
}

export default function IssueDetails({ params }: IssueDetailsProps) {
	const id = params.id;
	const { data } = useGetSingleIssueQuery(id);
	const issue = data?.issue;
	const router = useRouter();

	const canUpdate = issue?.can_update ?? false;

	const canDelete = issue?.can_delete ?? false;

	const [deleteIssue] = useDeleteIssueMutation();

	const handleDeleteIssue = async () => {
		if (issue?.id) {
			try {
				await deleteIssue(issue.id).unwrap();
				router.push("/profile");
				toast.success("Your maintenance request was removed");
			} catch (e) {
				const errorMessage = extractErrorMessage(e);
				toast.error(errorMessage || "An error occurred");
			}
		}
	};
	return (
		<Card className="overflow-hidden rounded-2xl border-surface-border bg-surface shadow-card dark:border-slate-700 dark:bg-slate-900/60">
			<AuthFormHeader
				title={issue?.title}
				linkText="Back to my requests"
				linkHref="/profile"
			/>

			<CardHeader className="flex flex-col justify-between gap-4 border-b border-surface-border p-6 md:flex-row md:items-center dark:border-slate-700">
				<div className="grid gap-0.5">
					<CardTitle className="dark:text-platinum">
						<p className="flex items-center space-x-2">
							<Hotel className="tab-icon" />
							<span className="dark:text-babyPowder font-bold">Unit </span>
							<span className="text-2xl">{issue?.apartment_unit}</span>
						</p>
					</CardTitle>

					<CardDescription className="mt-2">
						<p className="flex items-center space-x-2">
							<CheckCheck className="tab-icon" />
							<span className="text-xl-font-baby">Submitted by </span>
							<span className="text-xl-font-baby">{issue?.reported_by}</span>
						</p>
					</CardDescription>
				</div>

				<div className="flex flex-col gap-y-3">
					{canUpdate && (
						<Link href={`/issue/update-issue/${id}`}>
							<Button
								className="electricIndigo-gradient ml-auto h-10 max-w-[200px] sm:ml-0 md:max-w-[300px]"
								size="sm"
							>
								Update request
							</Button>
						</Link>
					)}

					{canDelete && (
						<Button
							onClick={handleDeleteIssue}
							className="text-babyPowder dark:text-babyPowder ml-auto h-10 max-w-[200px] bg-red-500 sm:ml-0 md:max-w-[300px] dark:bg-red-500"
							size="sm"
							variant="outline"
						>
							Cancel request
						</Button>
					)}
				</div>
			</CardHeader>

			<CardContent className="border-b border-surface-border p-6 dark:border-slate-700">
				<CardDescription className="mt-3">
					<div className="flex items-center space-x-2">
						<CircleDot className="tab-icon" />
						<span className="text-xl-font-baby">{issue?.description}</span>
					</div>
				</CardDescription>
			</CardContent>
			{issue?.id && (
				<CardContent className="border-b border-surface-border p-6 dark:border-slate-700">
					<MaintenanceTriagePanel issueId={issue.id} />
				</CardContent>
			)}
			<CardFooter className="flex flex-col gap-3 p-6 text-sm text-ink-muted sm:flex-row sm:flex-wrap sm:justify-between dark:text-slate-400">
				<p className="text-lg">
					Handled by:
					<span className="dark:text-platinum">
						{issue?.assigned_to || "Not assigned yet"}
					</span>
				</p>
				<p className="text-lg">
					Status:
					<span className="dark:text-platinum">{issue?.status}</span>
				</p>
				<p className="text-lg">
					Priority:
					<span className="dark:text-platinum">{issue?.priority}</span>
				</p>
				<p className="flex flex-row items-center">
					<EyeIcon className="mr-1 size-5" />
					<span className="dark:text-platinum text-lg">
						View Count: {issue?.view_count}
					</span>
				</p>
			</CardFooter>
		</Card>
	);
}
