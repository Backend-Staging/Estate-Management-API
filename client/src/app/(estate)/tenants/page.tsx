import TenantCard from "@/components/cards/TenantCard";
import ProtectedRoute from "@/components/shared/ProtectedRoutes";
import { tenantMetadata } from "@/constants/tenant";
import type { Metadata } from "next";

export const metadata: Metadata = tenantMetadata(
	"Residents",
	"View residents in your building.",
);

function TenantsPageContent() {
	return (
		<div>
			<TenantCard />
		</div>
	);
}

export default function TenantsPage() {
	return (
		<ProtectedRoute>
			<TenantsPageContent />
		</ProtectedRoute>
	);
}
