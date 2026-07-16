import type { LucideIcon } from "lucide-react";
import {
	BarChart3,
	Bot,
	BrainCircuit,
	Building2,
	Cloud,
	MessageSquare,
	Shield,
	Sparkles,
	Wrench,
} from "lucide-react";

export const PLATFORM = {
	name: "CyberSys",
	tagline: "AI-Powered Estate Management",
	description:
		"Production-oriented platform for property operations, tenant communication, and intelligent maintenance workflows.",
} as const;

export type PlatformFeatureStatus = "live" | "beta" | "planned";

export interface PlatformFeature {
	id: string;
	title: string;
	description: string;
	capabilities: string[];
	status: PlatformFeatureStatus;
	icon: LucideIcon;
	href?: string;
}

export const AI_FEATURES: PlatformFeature[] = [
	{
		id: "triage",
		title: "AI Maintenance Triage",
		description:
			"Automatically classifies maintenance requests and routes them to the right team.",
		capabilities: [
			"Category detection",
			"Urgency & emergency flags",
			"Department routing",
			"Tenant & staff summaries",
		],
		status: "live",
		icon: Wrench,
		href: "/report-issue",
	},
	{
		id: "rag",
		title: "Property Knowledge Assistant",
		description:
			"RAG-powered answers across leases, policies, HOA guidelines, and emergency procedures.",
		capabilities: [
			"Lease & policy Q&A",
			"Emergency procedure lookup",
			"Maintenance documentation",
		],
		status: "planned",
		icon: BrainCircuit,
	},
	{
		id: "work-order",
		title: "AI Work Order Assistant",
		description:
			"Operational intelligence for staff — summaries, deduplication, and escalation guidance.",
		capabilities: [
			"Work order summaries",
			"Duplicate issue detection",
			"Escalation recommendations",
		],
		status: "planned",
		icon: Sparkles,
	},
	{
		id: "tenant-comms",
		title: "Tenant Communication Assistant",
		description:
			"Conversational AI for tenant interaction, notifications, and issue reporting.",
		capabilities: [
			"SMS & voice workflows",
			"AI-powered notifications",
			"Conversational reporting",
		],
		status: "planned",
		icon: MessageSquare,
	},
	{
		id: "ops-dashboard",
		title: "AI Operations Dashboard",
		description:
			"Real-time analytics for maintenance volume, response times, and building insights.",
		capabilities: [
			"Open request tracking",
			"Response-time analytics",
			"Category & satisfaction trends",
		],
		status: "beta",
		icon: BarChart3,
	},
];

export interface RoadmapItem {
	phase: string;
	title: string;
	items: string[];
}

export const VISION_ROADMAP: RoadmapItem[] = [
	{
		phase: "Now",
		title: "Core platform",
		items: [
			"Role-based tenant & agent portals",
			"Maintenance issue lifecycle",
			"AI maintenance triage engine",
			"Community posts & tenant reports",
		],
	},
	{
		phase: "Next",
		title: "AI expansion",
		items: [
			"RAG property knowledge assistant",
			"Work order intelligence",
			"Operations dashboard analytics",
			"Tenant communication automation",
		],
	},
	{
		phase: "Scale",
		title: "Enterprise readiness",
		items: [
			"Multi-tenant SaaS architecture",
			"Kubernetes & Terraform automation",
			"Observability (Prometheus/Grafana)",
			"Event-driven microservices",
		],
	},
];

export const PLATFORM_PILLARS = [
	{
		title: "Property operations",
		description: "Units, tenants, issues, and repair workflows in one system.",
		icon: Building2,
	},
	{
		title: "AI automation",
		description: "Triage, summarization, and knowledge retrieval at scale.",
		icon: Bot,
	},
	{
		title: "Cloud-native",
		description: "Containerized services with distributed task processing.",
		icon: Cloud,
	},
	{
		title: "Enterprise security",
		description: "JWT auth, RBAC, rate limiting, and tenant data isolation.",
		icon: Shield,
	},
] as const;

export const STATUS_LABELS: Record<PlatformFeatureStatus, string> = {
	live: "Live",
	beta: "Beta",
	planned: "Coming soon",
};
