"use client";

import { useGetAllPostsQuery } from "@/lib/redux/features/posts/postApiSlice";
import { useAppSelector } from "@/lib/redux/hooks/typedHooks";
import { PostState } from "@/types";
import {
	formatDate,
	getRepliesText,
	getViewText,
	sortByDateDescending,
} from "@/utils";
import Spinner from "../shared/Spinner";
import Link from "next/link";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { formatDistanceToNow, parseISO } from "date-fns";
import { EyeIcon, MessageSquareQuoteIcon, Plus } from "lucide-react";
import PaginationSection from "../shared/PaginationSection";

export default function PostCard() {
	const page = useAppSelector((state: PostState) => state.post.page);
	const { data, isLoading } = useGetAllPostsQuery({ page });

	const totalCount = data?.posts.count || 0;
	const totalPages = Math.ceil(totalCount / 9);

	const sortedPosts = sortByDateDescending(
		data?.posts.results ?? [],
		"created_at",
	);

	if (isLoading) {
		return (
			<div className="flex-center pt-16">
				<Spinner size="xl" />
			</div>
		);
	}

	return (
		<>
			<div className="flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<p className="text-sm text-ink-muted dark:text-slate-400">
					{totalCount === 0
						? "Be the first to post — share news, events, or items with neighbors."
						: `${totalCount} post${totalCount !== 1 ? "s" : ""} from your building`}
				</p>

				<Link href="/add-post" className="flex justify-end max-sm:w-full">
					<Button className="electricIndigo-gradient gap-2">
						<Plus className="size-4" />
						Share something
					</Button>
				</Link>
			</div>

			<div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
				{sortedPosts && sortedPosts.length > 0 ? (
					sortedPosts.map((postItem) => (
						<Card
							key={postItem.id}
							className="flex flex-col border-surface-border bg-surface shadow-card transition hover:shadow-elevated dark:border-slate-700 dark:bg-slate-900/60"
						>
							<CardHeader className="pb-3">
								<CardTitle className="line-clamp-2 text-lg font-semibold text-ink dark:text-slate-100">
									{postItem.title}
								</CardTitle>
								<CardDescription className="space-y-1 text-xs text-ink-muted dark:text-slate-500">
									<div>
										Posted{" "}
										<span className="font-medium text-brand-600 dark:text-brand-400">
											{formatDate(postItem.created_at).toString()}
										</span>
									</div>
									<div>
										Updated{" "}
										{formatDistanceToNow(parseISO(postItem.updated_at), {
											addSuffix: true,
										})}
									</div>
								</CardDescription>
							</CardHeader>

							<CardContent className="flex-1 border-t border-surface-border py-4 text-sm dark:border-slate-700">
								<p className="line-clamp-3 text-ink-muted dark:text-slate-400">
									{postItem.body}
								</p>
							</CardContent>

							<div className="flex items-center justify-between border-t border-surface-border p-4 dark:border-slate-700">
								<Link href={`/post/${postItem.slug}`}>
									<Button size="sm" variant="outline" className="text-xs">
										Read more
									</Button>
								</Link>

								<div className="flex items-center gap-4 text-xs text-ink-muted dark:text-slate-500">
									<span className="flex-row-center gap-1">
										<EyeIcon className="size-3.5 text-brand-500" />
										{getViewText(postItem.view_count)}
									</span>
									<span className="flex-row-center gap-1">
										<MessageSquareQuoteIcon className="size-3.5 text-brand-500" />
										{getRepliesText(postItem.replies_count)}
									</span>
								</div>
							</div>
						</Card>
					))
				) : (
					<p className="col-span-full py-12 text-center text-ink-muted dark:text-slate-500">
						The board is quiet for now. Start a conversation with your neighbors.
					</p>
				)}
			</div>

			<PaginationSection totalPages={totalPages} entityType="post" />
		</>
	);
}
