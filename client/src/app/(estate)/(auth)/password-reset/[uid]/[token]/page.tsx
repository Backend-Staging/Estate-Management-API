import { AuthFormHeader } from "@/components/forms/auth";
import PasswordResetConfirmForm from "@/components/forms/auth/PasswordResetConfirmForm";
import { tenantMetadata } from "@/constants/tenant";
import type { Metadata } from "next";

export const metadata: Metadata = tenantMetadata(
	"New Password",
	"Choose a new password for your account.",
);

export default function ForgotPassword() {
	return (
		<div>
			<AuthFormHeader title="Choose a new password" />
			<div className="mt-7 sm:mx-auto sm:w-full sm:max-w-[480px]">
				<div className="bg-lightGrey dark:bg-deepBlueGrey px-6 py-12 shadow sm:rounded-lg sm:px-12 md:rounded-3xl">
					<PasswordResetConfirmForm />
				</div>
			</div>
		</div>
	);
}
