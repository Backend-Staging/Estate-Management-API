import * as z from "zod";

export const issueCreateSchema = z.object({
	title: z.string().trim().min(1, "An Issue must have a title"),
	description: z.string().min(1, "An Issue must have a description"),
	priority: z.enum(["low", "medium", "high"]),
	status: z.enum(["reported", "resolved", "in_progress"]),
	assigned_to: z.string().optional(),
});

export type TIssueCreateSchema = z.infer<typeof issueCreateSchema>;
