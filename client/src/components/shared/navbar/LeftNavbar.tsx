"use client";

import { Button } from "@/components/ui/button";
import { useAuthNavigation } from "@/hooks";
import {
	AlertCircle,
	Bookmark,
	Home,
	LogOut,
	MessageSquare,
	MessageSquarePlus,
	User,
	Users,
	Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

const navIcons: Record<string, LucideIcon> = {
	"/welcome": Home,
	"/profile": User,
	"/tenants": Users,
	"/technicians": Wrench,
	"/report-issue": AlertCircle,
	"/help": MessageSquare,
	"/bookmark": Bookmark,
	"/add-post": MessageSquarePlus,
};

export default function LeftNavbar() {
	const pathname = usePathname();
	const { handleLogout, filteredNavLinks, isAuthenticated } =
		useAuthNavigation();

	return (
		<aside className="custom-scrollbar sticky left-0 top-0 hidden h-screen w-[260px] flex-col justify-between overflow-y-auto border-r border-surface-border bg-white p-5 pt-28 lg:flex dark:border-slate-800 dark:bg-slate-900">
			<nav className="flex flex-1 flex-col gap-1">
				{filteredNavLinks.map((linkItem) => {
					const isActive =
						(pathname.includes(linkItem.path) && linkItem.path.length > 1) ||
						pathname === linkItem.path;
					const Icon = navIcons[linkItem.path] ?? Home;

					return (
						<Link
							href={linkItem.path}
							key={linkItem.label}
							className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
								isActive
									? "bg-brand-500/10 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
									: "text-ink-muted hover:bg-slate-100 hover:text-ink dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
							}`}
						>
							<Icon className="size-4 shrink-0" />
							<span>{linkItem.label}</span>
						</Link>
					);
				})}
			</nav>

			<div className="mt-6 border-t border-surface-border pt-4 dark:border-slate-800">
				{isAuthenticated ? (
					<Button
						onClick={handleLogout}
						variant="outline"
						className="w-full justify-start gap-2 border-surface-border text-ink-muted dark:border-slate-700 dark:text-slate-400"
					>
						<LogOut className="size-4" />
						Log out
					</Button>
				) : (
					<div className="flex flex-col gap-2">
						<Link href="/login">
							<Button variant="outline" className="w-full">
								Sign in
							</Button>
						</Link>
						<Link href="/register">
							<Button className="electricIndigo-gradient w-full">
								Join your building
							</Button>
						</Link>
					</div>
				)}
			</div>
		</aside>
	);
}
