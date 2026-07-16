import re

from core_apps.issues.models import Issue

from .llm_client import llm_json
from .rule_triage import build_issue_context


def _normalize(text: str) -> set[str]:
    return {
        word
        for word in re.findall(r"[a-z0-9']+", text.lower())
        if len(word) > 2
    }


class WorkOrderAssistantService:

    def analyze(self, issue: Issue) -> dict:
        context = build_issue_context(issue)
        duplicates = self._find_duplicates(issue)
        rule_result = self._rule_based_insight(issue, duplicates)

        llm_result = llm_json(
            f"""You are a maintenance work order assistant for property staff.

Analyze this issue and return JSON:
{{
  "work_order_summary": "2-3 sentence staff summary",
  "suggested_tenant_response": "friendly message staff can send the tenant",
  "escalation_recommendation": "when/how to escalate",
  "should_escalate": false
}}

Issue context:
{context}

Possible duplicate issue IDs: {[str(d["id"]) for d in duplicates]}
""",
            system="Return only valid JSON.",
        )

        if llm_result:
            result = {
                "work_order_summary": str(
                    llm_result.get("work_order_summary", rule_result["work_order_summary"])
                ),
                "suggested_tenant_response": str(
                    llm_result.get(
                        "suggested_tenant_response",
                        rule_result["suggested_tenant_response"],
                    )
                ),
                "escalation_recommendation": str(
                    llm_result.get(
                        "escalation_recommendation",
                        rule_result["escalation_recommendation"],
                    )
                ),
                "duplicate_issues": duplicates,
                "should_escalate": bool(llm_result.get("should_escalate", False)),
                "provider": "llm",
            }
        else:
            result = {**rule_result, "provider": "rules"}

        result["issue_id"] = str(issue.id)
        return result

    def _find_duplicates(self, issue: Issue) -> list[dict]:
        tokens = _normalize(f"{issue.title} {issue.description}")
        if not tokens:
            return []

        candidates = (
            Issue.objects.filter(apartment__building=issue.apartment.building)
            .exclude(id=issue.id)
            .exclude(status=Issue.IssueStatus.RESOLVED)
            .select_related("apartment")[:20]
        )

        duplicates = []
        for candidate in candidates:
            candidate_tokens = _normalize(f"{candidate.title} {candidate.description}")
            overlap = tokens & candidate_tokens
            if len(overlap) >= 2:
                duplicates.append(
                    {
                        "id": str(candidate.id),
                        "title": candidate.title,
                        "unit": candidate.apartment.unit_number,
                        "status": candidate.status,
                        "overlap_terms": sorted(overlap)[:5],
                    }
                )

        return duplicates[:5]

    def _rule_based_insight(self, issue: Issue, duplicates: list[dict]) -> dict:
        summary = (
            f"{issue.title} in unit {issue.apartment.unit_number} is "
            f"{issue.status.replace('_', ' ')} with {issue.priority} priority."
        )
        if duplicates:
            summary += (
                f" {len(duplicates)} similar open request(s) were found in this building."
            )

        tenant_response = (
            f"Hi — we received your request about \"{issue.title}\" and our team is "
            f"reviewing it. Current status: {issue.status.replace('_', ' ')}."
        )

        escalation = "Monitor for 24 hours; escalate if unresolved or if tenant reports worsening conditions."
        if issue.priority == Issue.Priority.HIGH:
            escalation = (
                "High priority — assign a technician today and confirm resolution with the tenant."
            )
        if duplicates:
            escalation = (
                "Possible duplicate work orders detected. Consolidate assignments to avoid "
                "duplicate visits."
            )

        return {
            "work_order_summary": summary,
            "suggested_tenant_response": tenant_response,
            "escalation_recommendation": escalation,
            "duplicate_issues": duplicates,
            "should_escalate": issue.priority == Issue.Priority.HIGH,
        }
