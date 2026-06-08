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
					<h2 className="h2-semibold flex-center font-robotoSlab dark:text-pumpkin text-xl">
						Total: ({myIssue?.count ?? 0})
					</h2>
					<div className="mt-4 grid cursor-pointer grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						{myIssue && myIssue.results.length > 0 ? (
							myIssue.results.map((issue) => (
								<IssueCard key={issue.id} issue={issue} />
							))
						) : (
							<p className="h2-semibold dark:text-lime-500">
								You have not raised any issue(s) yet!
							</p>
						)}
					</div>
				</>
			)}
		</TabsContent>
	);
}
