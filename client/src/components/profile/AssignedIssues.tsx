"use client";

import { useGetMyAssignedIssuesQuery } from "@/lib/redux/features/issues/issueApiSlice";
import Spinner from "../shared/Spinner";
import { TabsContent } from "../ui/tabs";
import IssueCard from "../cards/IssueCard";

export default function AssignedIssues() {
	const { data: assignedIssues, isLoading } = useGetMyAssignedIssuesQuery();
	const myAssignedIssues = assignedIssues?.assigned_issues;
	const showLoading = isLoading && !myAssignedIssues;

	return (
		<TabsContent value="assigned-issues" className="p-4">
			{showLoading ? (
				<div className="flex min-h-[200px] items-center justify-center">
					<Spinner size="xl" />
				</div>
			) : (
				<>
					<h2 className="h2-semibold flex-center font-robotoSlab dark:text-pumpkin text-xl">
						Total: ({myAssignedIssues?.count ?? 0})
					</h2>
					<div className="mt-4 grid cursor-pointer grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						{myAssignedIssues && myAssignedIssues.results.length > 0 ? (
							myAssignedIssues.results.map((issue) => (
								<IssueCard key={issue.id} issue={issue} />
							))
						) : (
							<p className="h2-semibold dark:text-lime-500">
								No issue(s) assigned to you yet!
							</p>
						)}
					</div>
				</>
			)}
		</TabsContent>
	);
}
