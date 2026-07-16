"use client";

import { useGetMyIssuesQuery } from "@/lib/redux/features/issues/issueApiSlice";
import Spinner from "../shared/Spinner";
import { TabsContent } from "../ui/tabs";
import IssueCard from "../cards/IssueCard";

export default function Issues() {
	const { data, isLoading } = useGetMyIssuesQuery();
	const myIssue = data?.my_issues;
	const showLoading = isLoading && !myIssue;

	return (
		<TabsContent value="my-issues" className="p-4">
			{showLoading ? (
				<div className="flex min-h-[200px] items-center justify-center">
					<Spinner size="xl" />
				</div>
			) : (
				<>
					<h2 className="text-lg font-semibold text-ink dark:text-slate-100">
						Your maintenance requests ({myIssue?.count ?? 0})
					</h2>
					<div className="mt-4 grid cursor-pointer grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						{myIssue && myIssue.results.length > 0 ? (
							myIssue.results.map((issue) => (
								<IssueCard key={issue.id} issue={issue} />
							))
						) : (
							<p className="text-sm text-ink-muted dark:text-slate-500">
								You haven't submitted any maintenance requests yet.
							</p>
						)}
					</div>
				</>
			)}
		</TabsContent>
	);
}
