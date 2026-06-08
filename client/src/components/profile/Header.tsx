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
		<div className="flex flex-col items-center gap-3 py-2">
			<Avatar className="border-pumpkin mx-auto size-32 overflow-hidden rounded-full border-4 object-cover">
				<AvatarImage
					src={
						profile?.avatar ||
						(theme === "dark"
							? "/assets/icons/user-profile-circle.svg"
							: "/assets/icons/user-profile-light-circle.svg")
					}
					alt="profile image"
					width={128}
					height={128}
				/>
			</Avatar>
			<div className="flex flex-col items-center justify-center gap-2 text-center">
				<h1 className="font-robotoSlab dark:text-platinum text-3xl font-semibold sm:text-5xl">
					{profile?.full_name || "Your Profile"}
				</h1>
				<p className="dark:text-lime-500">@{profile?.username || "…"}</p>
				{profile?.role && (
					<Badge className="bg-eerieBlack text-babyPowder dark:bg-electricIndigo capitalize">
						{capitalizeFirstLetter(profile.role)}
					</Badge>
				)}
			</div>
		</div>
	);
}
