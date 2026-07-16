from core_apps.issues.models import Issue

from .llm_client import llm_json
from .prompt_builder import build_maintenance_triage_prompt
from .rule_triage import build_issue_context, classify_issue_rules

TRIAGE_FIELDS = (
    "category",
    "sub_category",
    "urgency",
    "department",
    "emergency",
    "tenant_summary",
    "staff_recommendation",
)


class MaintenanceTriageService:

    def analyze(self, issue: Issue) -> dict:
        issue_context = build_issue_context(issue)
        prompt = build_maintenance_triage_prompt(issue_context)

        result = self._analyze_with_llm(prompt)
        if not result:
            result = classify_issue_rules(issue_context)

        result.setdefault("sub_category", "")
        result["issue_id"] = issue.id
        result["current_status"] = issue.status
        result["current_priority"] = issue.priority
        result["prompt_used"] = prompt
        result["provider"] = "llm" if result.get("_from_llm") else "rules"
        result.pop("_from_llm", None)
        return result

    def _analyze_with_llm(self, prompt: str) -> dict | None:
        parsed = llm_json(
            prompt,
            system=(
                "You are a maintenance triage assistant. "
                "Return only valid JSON matching the requested schema."
            ),
        )
        if not parsed:
            return None

        normalized = {
            "category": str(parsed.get("category", "general")).lower(),
            "sub_category": str(parsed.get("sub_category", "")).lower(),
            "urgency": str(parsed.get("urgency", "medium")).lower(),
            "department": str(parsed.get("department", "maintenance")).lower(),
            "emergency": bool(parsed.get("emergency", False)),
            "tenant_summary": str(
                parsed.get("tenant_summary", "Your request has been reviewed.")
            ),
            "staff_recommendation": str(
                parsed.get(
                    "staff_recommendation",
                    "Review and assign to the appropriate team.",
                )
            ),
            "_from_llm": True,
        }

        if normalized["urgency"] == "emergency":
            normalized["emergency"] = True

        return normalized
