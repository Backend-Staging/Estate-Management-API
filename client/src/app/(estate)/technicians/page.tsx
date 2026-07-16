import TechnicianCard from "@/components/cards/TechnicianCard";
import { tenantMetadata } from "@/constants/tenant";
import type { Metadata } from "next";

export const metadata: Metadata = tenantMetadata(
	"Technicians",
	"See who handles maintenance in your building.",
);

export default function TechniciansPage() {
	return (
		<>
			<TechnicianCard />
		</>
	);
}
