"use client";

import {
	useGetPopularTagsQuery,
	useGetTopPostsQuery,
} from "@/lib/redux/features/posts/postApiSlice";
import { useAppSelector } from "@/lib/redux/hooks/typedHooks";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function RightNavbar() {
	const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
	const { data } = useGetTopPostsQuery(undefined, { skip: !isAuthenticated });
	const topPosts = data?.top_posts.results;
	const { data: tagData } = useGetPopularTagsQuery(undefined, {
		skip: !isAuthenticated,
	});

	if (!isAuthenticated) return null;

	return (
		<section className="bg-baby_rich light-border custom-scrollbar shadow-platinum sticky right-0 top-0 flex h-screen w-[280px] flex-col justify-between overflow-y-auto border-l p-6 pt-36 max-xl:hidden dark:shadow-none">
			<div>
				<h3 className="text-sm font-semibold uppercase tracking-wider text-ink-subtle dark:text-slate-500">
					Popular in your building
				</h3>
				<div className="mt-7 flex w-full flex-col gap-[30px]">
					{topPosts && topPosts.length > 0 ? (
						topPosts.map((post) => (
							<Link
								key={post.id}
								href={`/post/${post.slug}`}
								className="flex cursor-pointer items-center justify-between gap-7"
							>
								<p className="hover:text-electricIndigo dark:text-platinum dark:hover:text-lime-500">
									{post.title.length > 20
										? `${post.title.substring(0, 20)}....`
										: post.title}
								</p>
								<ChevronRight className="tab-icon text-pumpkin" />
							</Link>
						))
					) : (
						<p className="text-sm text-ink-muted dark:text-slate-500">
							No posts yet — check back soon.
						</p>
					)}
				</div>
			</div>

			<div>
				<h3 className="text-sm font-semibold uppercase tracking-wider text-ink-subtle dark:text-slate-500">
					Topics
				</h3>
				<div className="mt-7 flex w-full flex-col gap-[30px]">
					{tagData && tagData.popular_tags.results.length > 0 ? (
						tagData.popular_tags.results.slice(0, 5).map((tag) => (
							<Link
								key={tag.slug}
								href={`/tags/${tag.slug}`}
								className="flex cursor-pointer items-center justify-between gap-7"
							>
								<div className="flex items-center gap-2">
									<span className="hover:text-electricIndigo dark:text-platinum dark:hover:text-pumpkin">
										{tag.name}
									</span>
									<span className="dark:text-platinum">({tag.post_count})</span>
								</div>
								<ChevronRight className="tab-icon text-pumpkin" />
							</Link>
						))
					) : (
						<p className="text-sm text-ink-muted dark:text-slate-500">
							No topics yet — they'll appear as neighbors post.
						</p>
					)}
				</div>
			</div>
		</section>
	);
}
