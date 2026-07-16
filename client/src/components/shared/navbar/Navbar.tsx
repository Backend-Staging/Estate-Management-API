import { TENANT_APP } from "@/constants/tenant";
import { Home } from "lucide-react";
import Link from "next/link";
import MobileNavbar from "./MobileNavbar";
import ThemeSwitcher from "./ThemeSwitcher";
import AuthAvatar from "@/components/shared/navbar/AuthAvatar";

export default function Navbar() {
	return (
		<nav className="fixed z-50 flex w-full items-center justify-between gap-5 border-b border-surface-border bg-white/90 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-10 dark:border-slate-800 dark:bg-slate-950/90">
			<Link href="/welcome" className="flex items-center gap-3">
				<div className="flex size-10 items-center justify-center rounded-lg bg-brand-600 text-white">
					<Home className="size-5" />
				</div>
				<div className="hidden sm:block">
					<p className="font-display text-lg font-bold tracking-tight text-ink dark:text-slate-100">
						{TENANT_APP.name}
					</p>
					<p className="text-xs text-ink-muted dark:text-slate-500">
						{TENANT_APP.tagline}
					</p>
				</div>
			</Link>

			<div className="flex items-center gap-3 sm:gap-5">
				<Link
					href="/welcome"
					className="hidden text-sm font-medium text-ink-muted transition hover:text-brand-600 md:inline dark:text-slate-400 dark:hover:text-brand-400"
				>
					Board
				</Link>
				<ThemeSwitcher />
				<AuthAvatar />
				<MobileNavbar />
			</div>
		</nav>
	);
}
