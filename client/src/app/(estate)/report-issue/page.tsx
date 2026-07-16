import { AuthFormHeader } from "@/components/forms/auth";
import CreateIssueForm from "@/components/forms/report-issue/CreateIssueForm";
import { TENANT_APP } from "@/constants/tenant";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: `Maintenance | ${TENANT_APP.name}`,
	description:
		"Tell us what's wrong in your unit and we'll get the right team to help.",
};

export default function ReportIssuePage() {
	return (
		<div className="mx-auto max-w-lg">
			<AuthFormHeader
				title="Need maintenance help?"
				staticText="Describe what's going on and we'll route it to building staff."
			/>
			<div className="mt-7 rounded-2xl border border-surface-border bg-surface px-6 py-10 shadow-card dark:border-slate-700 dark:bg-slate-900/60 sm:px-8">
				<CreateIssueForm />
			</div>
		</div>
	);
}
