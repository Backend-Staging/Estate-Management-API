import TenantHome from "@/components/tenant/TenantHome";
import { TENANT_APP } from "@/constants/tenant";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: `${TENANT_APP.name} | Home`,
	description: TENANT_APP.description,
};

export default function WelcomePage() {
	return <TenantHome />;
}
