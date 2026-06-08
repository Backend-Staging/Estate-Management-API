"use client";

import { TabsContent } from "@/components/ui/tabs";

export default function Posts() {
	return (
		<TabsContent value="posts" className="p-4">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<h3 className="h3-semibold dark:text-platinum">Placeholder posts</h3>
			</div>
		</TabsContent>
	);
}
