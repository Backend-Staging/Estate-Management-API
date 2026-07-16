import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import {
	CalendarHeart,
	MessageSquareHeart,
	ShieldAlert,
	Wrench,
} from "lucide-react";
import { LeftNavLink } from "@/types";

/** Resident-facing branding — not agency/marketing copy */
export const TENANT_APP = {
	name: "Community Board",
	tagline: "Your building, connected",
	description:
		"Share updates with neighbors, post events, and get maintenance help — all in one place.",
} as const;

export function tenantPageTitle(page: string): string {
	return `${page} | ${TENANT_APP.name}`;
}

export function tenantMetadata(page: string, description: string): Metadata {
	return {
		title: tenantPageTitle(page),
		description,
	};
}

export const tenantNavLinks: LeftNavLink[] = [
	{
		path: "/welcome",
		label: "Community Board",
		imgLocation: "/assets/icons/home.svg",
	},
	{
		path: "/add-post",
		label: "New Post",
		imgLocation: "/assets/icons/question-file.svg",
	},
	{
		path: "/report-issue",
		label: "Maintenance",
		imgLocation: "/assets/icons/report.svg",
	},
	{
		path: "/profile",
		label: "My Profile",
		imgLocation: "/assets/icons/user-profile.svg",
	},
	{
		path: "/bookmark",
		label: "Saved Posts",
		imgLocation: "/assets/icons/bookmark.svg",
	},
];

/** Staff-only sidebar items (repair / management workflows) */
export const staffNavLinks: LeftNavLink[] = [
	{
		path: "/tenants",
		label: "Residents",
		imgLocation: "/assets/icons/tenants.svg",
	},
	{
		path: "/technicians",
		label: "Technicians",
		imgLocation: "/assets/icons/technician.svg",
	},
];

export const QUICK_ACTIONS = [
	{
		title: "Post to the board",
		description: "Events, items for sale, questions, or building news",
		href: "/add-post",
		cta: "Create post",
		variant: "primary" as const,
	},
	{
		title: "Maintenance request",
		description: "Leaks, heat, appliances — we'll get someone on it",
		href: "/report-issue",
		cta: "Report issue",
		variant: "default" as const,
	},
	{
		title: "My requests",
		description: "Track open maintenance and past resolutions",
		href: "/profile",
		cta: "View profile",
		variant: "default" as const,
	},
] as const;

export const EMERGENCY_GUIDANCE = {
	title: "Emergency?",
	description:
		"For fire, gas leaks, flooding, or immediate danger, call 911 first. Then report through Maintenance so building staff are notified.",
	cta: "Report urgent issue",
	href: "/report-issue",
} as const;

export const TENANT_HERO_PILLARS: {
	title: string;
	description: string;
	icon: LucideIcon;
}[] = [
	{
		title: "Building board",
		description: "Post events, sell items, ask questions, and share news with neighbors.",
		icon: MessageSquareHeart,
	},
	{
		title: "Community events",
		description: "Coordinate meetups, yard sales, and building activities in one place.",
		icon: CalendarHeart,
	},
	{
		title: "Maintenance help",
		description: "Report leaks, heat, or appliance issues and track progress on repairs.",
		icon: Wrench,
	},
	{
		title: "Urgent situations",
		description: "Get building staff notified quickly when something needs immediate attention.",
		icon: ShieldAlert,
	},
];
