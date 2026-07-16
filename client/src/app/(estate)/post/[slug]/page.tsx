import PostDetails from "@/components/post/PostDetails";
import { tenantMetadata } from "@/constants/tenant";
import type { Metadata } from "next";

export const metadata: Metadata = tenantMetadata(
	"Post",
	"Read a post from your building board and join the conversation.",
);

interface ParamsProps {
	params: {
		slug: string;
	};
}

export default function PostDetailPage({ params }: ParamsProps) {
	return (
		<>
			<PostDetails params={params} />
		</>
	);
}
