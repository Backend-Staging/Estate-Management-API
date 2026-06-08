from core_apps.issues.models import Issue
from .prompt_builder import build_maintenance_triage_prompt


class MaintenanceTriageService:

    def analyze(self, issue: Issue) -> dict:

        issue_context = f"""
        Issue Title:
        {issue.title}

        Issue Description:
        {issue.description}

        Current Status:
        {issue.status}

        Current Priority:
        {issue.priority}

        Apartment Unit:
        {issue.apartment.unit_number}

        Reported By:
        {issue.reported_by.get_full_name()}
        """

        prompt = build_maintenance_triage_prompt(issue_context)

        lowered = issue_context.lower()

        # Emergency / safety conditions
        if any(
            word in lowered
            for word in [
                "fire",
                "smoke",
                "sparking",
                "flood",
                "gas leak",
                "electrical burning",
                "burst pipe",
            ]
        ):
            result = {
                "category": "safety",
                "urgency": "emergency",
                "department": "emergency_services",
                "emergency": True,
                "tenant_summary": (
                    "This maintenance request appears to involve a possible "
                    "emergency or safety hazard."
                ),
                "staff_recommendation": (
                    "Escalate immediately and notify emergency maintenance staff."
                ),
            }

        # HVAC issues
        elif any(
            word in lowered
            for word in [
                "ac",
                "air conditioning",
                "hvac",
                "heat",
                "heating",
                "temperature",
            ]
        ):
            result = {
                "category": "hvac",
                "urgency": "high",
                "department": "maintenance",
                "emergency": False,
                "tenant_summary": (
                    "The request appears related to HVAC or temperature control."
                ),
                "staff_recommendation": (
                    "Assign to HVAC maintenance team and prioritize based on occupancy."
                ),
            }

        # Plumbing issues
        elif any(
            word in lowered
            for word in [
                "leak",
                "toilet",
                "sink",
                "water",
                "pipe",
                "drain",
            ]
        ):
            result = {
                "category": "plumbing",
                "urgency": "high",
                "department": "maintenance",
                "emergency": False,
                "tenant_summary": (
                    "The request appears related to plumbing or water systems."
                ),
                "staff_recommendation": (
                    "Assign a plumbing technician for inspection and repair."
                ),
            }

        # Electrical issues
        elif any(
            word in lowered
            for word in [
                "outlet",
                "electric",
                "breaker",
                "power",
                "lights",
                "voltage",
            ]
        ):
            result = {
                "category": "electrical",
                "urgency": "high",
                "department": "maintenance",
                "emergency": False,
                "tenant_summary": (
                    "The request appears related to an electrical issue."
                ),
                "staff_recommendation": (
                    "Assign an electrical maintenance technician immediately."
                ),
            }

        # Pest control
        elif any(
            word in lowered
            for word in [
                "roach",
                "rats",
                "mice",
                "bugs",
                "pest",
                "infestation",
            ]
        ):
            result = {
                "category": "pest_control",
                "urgency": "medium",
                "department": "vendor",
                "emergency": False,
                "tenant_summary": (
                    "The request appears related to pest control."
                ),
                "staff_recommendation": (
                    "Schedule pest control vendor inspection."
                ),
            }

        # Appliance issues
        elif any(
            word in lowered
            for word in [
                "refrigerator",
                "fridge",
                "oven",
                "dishwasher",
                "washer",
                "dryer",
                "microwave",
            ]
        ):
            result = {
                "category": "appliance",
                "urgency": "medium",
                "department": "maintenance",
                "emergency": False,
                "tenant_summary": (
                    "The request appears related to an appliance issue."
                ),
                "staff_recommendation": (
                    "Assign appliance maintenance technician for review."
                ),
            }

        # General fallback
        else:
            result = {
                "category": "general",
                "urgency": "medium",
                "department": "property_management",
                "emergency": False,
                "tenant_summary": (
                    "The maintenance request has been categorized for review."
                ),
                "staff_recommendation": (
                    "Review the issue and assign to the appropriate team."
                ),
            }

        result["issue_id"] = issue.id
        result["current_status"] = issue.status
        result["current_priority"] = issue.priority
        result["prompt_used"] = prompt

        return result

