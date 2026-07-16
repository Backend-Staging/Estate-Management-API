import React from "react";

import type { Metadata } from "next";
import { AuthFormHeader } from "@/components/forms/auth";
import PasswordResetRequestForm from "@/components/forms/auth/PasswordResetRequestForm";
import { tenantMetadata } from "@/constants/tenant";

export const metadata: Metadata = tenantMetadata(
	"Reset Password",
	"Request a link to reset your password.",
);

export default function ForgotPassword() {
	return (
		<div>
			<AuthFormHeader
				title="Forgot your password?"
				staticText="Remember it now?"
				linkText="Back to sign in"
				linkHref="/login"
			/>
			<div className="mt-7 sm:mx-auto sm:w-full sm:max-w-[480px]">
				<div className="bg-lightGrey dark:bg-deepBlueGrey px-6 py-12 shadow sm:rounded-lg sm:px-12 md:rounded-3xl">
					<PasswordResetRequestForm />
				</div>
			</div>
		</div>
	);
}
