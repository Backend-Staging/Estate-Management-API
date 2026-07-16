import PostTagCard from "@/components/cards/PostTagCard";
import { tenantMetadata } from "@/constants/tenant";
import type { Metadata } from "next";

export const metadata: Metadata = tenantMetadata(
	"Topics",
	"Browse posts by topic on your building board.",
);

interface SlugParamsProps {
	params: {
		tagSlug: string;
	};
}

export default function TagPostsPage({ params }: SlugParamsProps) {
	return (
		<>
			<PostTagCard params={params} />
		</>
	);
}
