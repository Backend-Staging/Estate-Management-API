import React from "react";
import type { Metadata } from "next";
import { AuthFormHeader } from "@/components/forms/auth";
import UpdateIssueForm from "@/components/forms/update-issue/UpdateIssueForm";
import { tenantMetadata } from "@/constants/tenant";

export const metadata: Metadata = tenantMetadata(
	"Update Request",
	"Edit your maintenance request details.",
);

interface UpdateParamsProps {
	params: {
		id: string;
	};
}

export default function UpdateIssuePage({ params }: UpdateParamsProps) {
	return (
		<div>
			<AuthFormHeader
				title="Update your request"
				staticText="Need to make a change?"
				linkText="Back to my requests"
				linkHref="/profile"
			/>
			<div className="mt-7 sm:mx-auto sm:w-full sm:max-w-[480px]">
				<div className="bg-lightGrey dark:bg-deepBlueGrey rounded-xl px-6 py-12 shadow sm:rounded-lg sm:px-12 md:rounded-3xl">
					<UpdateIssueForm params={params} />
				</div>
			</div>
		</div>
	);
}
