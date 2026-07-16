import IssueDetails from "@/components/issue/IssueDetails";
import { tenantMetadata } from "@/constants/tenant";
import type { Metadata } from "next";

export const metadata: Metadata = tenantMetadata(
	"Maintenance Request",
	"View status and details for your maintenance request.",
);

interface ParamsProps {
	params: {
		id: string;
	};
}

export default function IssueDetailPage({ params }: ParamsProps) {
	return (
		<div>
			<IssueDetails params={params} />
		</div>
	);
}
