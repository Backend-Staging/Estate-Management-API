import { baseApiSlice } from "../api/baseApiSlice";

export interface KnowledgeSource {
	slug: string;
	title: string;
	category: string;
	excerpt: string;
	score?: number;
}

export interface KnowledgeAnswer {
	question: string;
	answer: string;
	sources: KnowledgeSource[];
}

export interface WorkOrderInsight {
	id?: string;
	work_order_summary: string;
	suggested_tenant_response: string;
	escalation_recommendation: string;
	duplicate_issues?: {
		id: string;
		title: string;
		unit: string;
		status: string;
	}[];
	should_escalate?: boolean;
	provider?: string;
}

export interface OperationsAnalytics {
	open_issues: number;
	resolved_issues: number;
	high_priority_open: number;
	emergency_triage_count: number;
	avg_resolution_days: number | null;
	avg_satisfaction_rating: number | null;
	issues_last_30_days: number;
	triage_last_30_days: number;
	category_breakdown: { category: string; count: number }[];
	priority_breakdown: { priority: string; count: number }[];
	triage_total: number;
}

export interface TenantChatResponse {
	message: string;
	reply: string;
	sources?: KnowledgeSource[];
}

export const aiApiSlice = baseApiSlice.injectEndpoints({
	endpoints: (builder) => ({
		triageMaintenanceIssue: builder.mutation({
			query: (issueId: number | string) => ({
				url: `/ai-assistant/triage/maintenance/${issueId}/`,
				method: "POST",
				body: {},
			}),
		}),
		queryKnowledge: builder.mutation<KnowledgeAnswer, { question: string }>({
			query: (body) => ({
				url: "/ai-assistant/knowledge/query/",
				method: "POST",
				body,
			}),
		}),
		assistWorkOrder: builder.mutation<WorkOrderInsight, number | string>({
			query: (issueId) => ({
				url: `/ai-assistant/work-order/${issueId}/`,
				method: "POST",
				body: {},
			}),
		}),
		getOperationsAnalytics: builder.query<OperationsAnalytics, void>({
			query: () => "/ai-assistant/analytics/operations/",
		}),
		sendTenantChat: builder.mutation<TenantChatResponse, { message: string }>({
			query: (body) => ({
				url: "/ai-assistant/chat/tenant/",
				method: "POST",
				body,
			}),
		}),
	}),
});

export const {
	useTriageMaintenanceIssueMutation,
	useQueryKnowledgeMutation,
	useAssistWorkOrderMutation,
	useGetOperationsAnalyticsQuery,
	useSendTenantChatMutation,
} = aiApiSlice;
