import CreatePostForm from "@/components/forms/add-post/CreatePostForm";
import { AuthFormHeader } from "@/components/forms/auth";
import { TENANT_APP } from "@/constants/tenant";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: `New Post | ${TENANT_APP.name}`,
	description:
		"Share an event, sell something, ask a question, or post a building update for your neighbors.",
};

export default function AddPostPage() {
	return (
		<div className="mx-auto max-w-lg">
			<AuthFormHeader
				title="Share with your building"
				staticText="Post events, items for sale, questions, or anything neighbors should know."
				linkText="Back to board"
				linkHref="/welcome"
			/>
			<div className="mt-7 rounded-2xl border border-surface-border bg-surface px-6 py-10 shadow-card dark:border-slate-700 dark:bg-slate-900/60 sm:px-8">
				<CreatePostForm />
			</div>
		</div>
	);
}
