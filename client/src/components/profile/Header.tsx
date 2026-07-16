"use client";

import { useTheme } from "next-themes";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { capitalizeFirstLetter } from "@/utils";
import { Profile } from "@/types";

interface HeaderProps {
	profile?: Profile;
}

export default function Header({ profile }: HeaderProps) {
	const { theme } = useTheme();

	return (
		<div className="flex flex-col items-center gap-4 rounded-2xl border border-surface-border bg-surface p-8 shadow-card dark:border-slate-700 dark:bg-slate-900/60">
			<Avatar className="size-28 overflow-hidden rounded-full border-4 border-brand-500/20 ring-4 ring-brand-500/10">
				<AvatarImage
					src={
						profile?.avatar ||
						(theme === "dark"
							? "/assets/icons/user-profile-circle.svg"
							: "/assets/icons/user-profile-light-circle.svg")
					}
					alt="profile image"
					width={112}
					height={112}
				/>
			</Avatar>
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="font-display text-2xl font-bold tracking-tight text-ink dark:text-slate-100 sm:text-3xl">
					{profile?.full_name || "Your Profile"}
				</h1>
				<p className="text-sm text-ink-muted dark:text-slate-500">
					@{profile?.username || "…"}
				</p>
				{profile?.role && (
					<Badge className="bg-brand-500/10 capitalize text-brand-700 ring-1 ring-brand-500/20 dark:text-brand-300">
						{capitalizeFirstLetter(profile.role)}
					</Badge>
				)}
			</div>
		</div>
	);
}
