import BookmarkedPostCard from "@/components/cards/BookmarkedPostCard";
import { tenantMetadata } from "@/constants/tenant";
import type { Metadata } from "next";

export const metadata: Metadata = tenantMetadata(
	"Saved Posts",
	"Posts you've bookmarked from the building board.",
);

export default function BookmarkedPostsPage() {
	return (
		<>
			<BookmarkedPostCard />
		</>
	);
}
