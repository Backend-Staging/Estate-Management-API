"use client";

import { useGetMyPostsQuery } from "@/lib/redux/features/posts/postApiSlice";
import { formatDate } from "@/utils";
import Link from "next/link";
import Spinner from "../shared/Spinner";
import { TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";

export default function Posts() {
	const { data, isLoading } = useGetMyPostsQuery();
	const posts = data?.my_posts?.results ?? [];

	return (
		<TabsContent value="posts" className="p-4">
			{isLoading ? (
				<div className="flex min-h-[200px] items-center justify-center">
					<Spinner size="xl" />
				</div>
			) : (
				<>
					<h2 className="text-lg font-semibold text-ink dark:text-slate-100">
						Your board posts ({data?.my_posts?.count ?? 0})
					</h2>
					<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
						{posts.length > 0 ? (
							posts.map((post) => (
								<Link
									key={post.id}
									href={`/post/${post.slug}`}
									className="rounded-xl border border-surface-border p-4 transition hover:border-brand-500/30 hover:shadow-card dark:border-slate-700"
								>
									<h3 className="font-semibold text-ink dark:text-slate-100">
										{post.title}
									</h3>
									<p className="mt-2 line-clamp-2 text-sm text-ink-muted dark:text-slate-400">
										{post.body}
									</p>
									<p className="mt-3 text-xs text-ink-subtle dark:text-slate-500">
										Posted {formatDate(post.created_at).toString()}
									</p>
								</Link>
							))
						) : (
							<p className="text-sm text-ink-muted dark:text-slate-500">
								You haven't posted on the building board yet.
							</p>
						)}
					</div>
					<Link href="/add-post" className="mt-6 inline-block">
						<Button size="sm" className="electricIndigo-gradient">
							Share something with neighbors
						</Button>
					</Link>
				</>
			)}
		</TabsContent>
	);
}
