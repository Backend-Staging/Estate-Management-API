import ApartmentCreateForm from "@/components/forms/apartment/ApartmentCreateForm";
import { AuthFormHeader } from "@/components/forms/auth";
import { tenantMetadata } from "@/constants/tenant";
import type { Metadata } from "next";

export const metadata: Metadata = tenantMetadata(
	"Your Unit",
	"Add your apartment number so neighbors and staff know where you live.",
);

export default function AddApartmentPage() {
	return (
		<div>
			<AuthFormHeader
				title="Set up your unit"
				staticText="This helps with maintenance requests and building posts."
				linkText="Back to profile"
				linkHref="/profile"
			/>
			<div className="mt-7 sm:mx-auto sm:w-full sm:max-w-[480px]">
				<div className="bg-lightGrey dark:bg-deepBlueGrey rounded-xl px-6 py-12 shadow sm:rounded-lg sm:px-12 md:rounded-3xl">
					<ApartmentCreateForm />
				</div>
			</div>
		</div>
	);
}
