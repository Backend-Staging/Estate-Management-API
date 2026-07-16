import CreateRatingForm from "@/components/forms/add-rating/CreateRatingForm";
import { AuthFormHeader } from "@/components/forms/auth";
import { tenantMetadata } from "@/constants/tenant";
import type { Metadata } from "next";

export const metadata: Metadata = tenantMetadata(
	"Rate Service",
	"Share feedback on maintenance work in your unit.",
);

export default function AddRatingPage() {
	return (
		<div>
			<AuthFormHeader
				title="How was the service?"
				staticText="Your feedback helps keep maintenance quality high."
				linkText="Back to technicians"
				linkHref="/technicians"
			/>
			<div className="mt-7 sm:mx-auto sm:w-full sm:max-w-[480px]">
				<div className="bg-lightGrey dark:bg-deepBlueGrey rounded-xl px-6 py-12 shadow sm:rounded-lg sm:px-12 md:rounded-3xl">
					<CreateRatingForm />
				</div>
			</div>
		</div>
	);
}
