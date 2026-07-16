import { AuthFormHeader } from "@/components/forms/auth";
import CreateReportForm from "@/components/forms/report-tenant/CreateReportForm";
import { tenantMetadata } from "@/constants/tenant";
import type { Metadata } from "next";

export const metadata: Metadata = tenantMetadata(
	"Report a Concern",
	"Raise a private concern about building safety or neighbor conduct.",
);

export default function ReportTenantPage() {
	return (
		<div>
			<AuthFormHeader
				title="Report a concern"
				staticText="Reports are handled confidentially. Building staff will follow up without sharing your identity."
				linkText="Back to profile"
				linkHref="/profile"
			/>
			<div className="mt-7 sm:mx-auto sm:w-full sm:max-w-[480px]">
				<div className="bg-lightGrey dark:bg-deepBlueGrey rounded-xl px-6 py-12 shadow sm:rounded-lg sm:px-12 md:rounded-3xl">
					<CreateReportForm />
				</div>
			</div>
		</div>
	);
}
