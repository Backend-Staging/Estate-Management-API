import {baseApiSlice} from "../api/baseApiSlice";


export const aiApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        triageMaintenanceIssue: builder.mutation({
            query: (issueId: number | string) => ({
                url: `/ai-assistant/triage/maintenance/${issueId}/`,
                method: "POST",
                body: {},
            }),
        }),
    }),
});

export const {useTriageMaintenanceIssueMutation} = aiApiSlice;