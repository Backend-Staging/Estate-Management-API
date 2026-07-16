import { LeftNavLink } from "@/types";

export * from "./platform";
export * from "./tenant";

// Import your IssueData interface if it's defined in another file
// import { IssueData } from '@/types';

type OptionType = {
	value: "reported" | "resolved" | "in_progress" | "low" | "medium" | "high";
	label: string;
};

export const statusOptions: OptionType[] = [
	{ value: "reported", label: "Reported" },
	{ value: "resolved", label: "Resolved" },
	{ value: "in_progress", label: "In Progress" },
];

export const priorityOptions: OptionType[] = [
	{ value: "low", label: "Low" },
	{ value: "medium", label: "Medium" },
	{ value: "high", label: "High" },
];

export const occupationOptions = [
	{ value: "mason", label: "Mason" },
	{ value: "carpenter", label: "Carpenter" },
	{ value: "plumber", label: "Plumber" },
	{ value: "roofer", label: "Roofer" },
	{ value: "painter", label: "Painter" },
	{ value: "electrician", label: "Electrician" },
	{ value: "hvac", label: "HVAC" },
	{ value: "tenant", label: "Tenant" },
];

/** @deprecated Use tenantNavLinks — kept for imports that still reference leftNavLinks */
export { tenantNavLinks as leftNavLinks } from "./tenant";
