"use client";

import { useTriageMaintenanceIssueMutation } from "@/lib/redux/features/ai/aiAPISlice";

type Props = {
    issueId: number | string;

};

export default function MaintenanceTriagePanel({ issueId }: Props) {
    const [triageMaintenanceIssue, { isLoading, data, isError, error }] = useTriageMaintenanceIssueMutation();

    const handleTriage = async () => {
        try {
            await triageMaintenanceIssue(issueId).unwrap();
        } catch (err) {
            console.error("Error triaging issue:", err);
        }
    };

    return (
    <div className="rounded-lg border p-4 space-y-4">
      <div>
        <h3 className="text-lg font-semibold">AI Maintenance Triage</h3>
        <p className="text-sm text-gray-500">
          Analyze this issue and generate AI-powered routing recommendations.
        </p>
      </div>

      <button
        onClick={handleTriage}
        disabled={isLoading}
        className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {isLoading ? "Analyzing..." : "Run AI Triage"}
      </button>

      {isError && (
        <p className="text-sm text-red-600">
          AI triage failed. Check the API or authentication.
        </p>
      )}

      {data && (
        <div className="rounded-md bg-gray-50 p-4 space-y-2">
          <p><strong>Category:</strong> {data.category}</p>
          <p><strong>Urgency:</strong> {data.urgency}</p>
          <p><strong>Department:</strong> {data.department}</p>
          <p><strong>Emergency:</strong> {data.emergency ? "Yes" : "No"}</p>

          <div>
            <strong>Tenant Summary:</strong>
            <p className="text-sm">{data.tenant_summary}</p>
          </div>

          <div>
            <strong>Staff Recommendation:</strong>
            <p className="text-sm">{data.staff_recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}