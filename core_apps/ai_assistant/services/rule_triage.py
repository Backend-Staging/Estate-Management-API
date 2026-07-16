from core_apps.issues.models import Issue


def _reporter_name(issue: Issue) -> str:
    if hasattr(issue.reported_by, "get_full_name"):
        return issue.reported_by.get_full_name() or issue.reported_by.username
    return str(issue.reported_by)


def build_issue_context(issue: Issue) -> str:
    return f"""
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
{_reporter_name(issue)}
"""


def classify_issue_rules(issue_context: str) -> dict:
    lowered = issue_context.lower()

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
        return {
            "category": "safety",
            "sub_category": "life_safety",
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

    if any(
        word in lowered
        for word in ["ac", "air conditioning", "hvac", "heat", "heating", "temperature"]
    ):
        return {
            "category": "hvac",
            "sub_category": "climate",
            "urgency": "high",
            "department": "maintenance",
            "emergency": False,
            "tenant_summary": "The request appears related to HVAC or temperature control.",
            "staff_recommendation": (
                "Assign to HVAC maintenance team and prioritize based on occupancy."
            ),
        }

    if any(
        word in lowered
        for word in ["leak", "toilet", "sink", "water", "pipe", "drain"]
    ):
        return {
            "category": "plumbing",
            "sub_category": "water",
            "urgency": "high",
            "department": "maintenance",
            "emergency": False,
            "tenant_summary": "The request appears related to plumbing or water systems.",
            "staff_recommendation": (
                "Assign a plumbing technician for inspection and repair."
            ),
        }

    if any(
        word in lowered
        for word in ["outlet", "electric", "breaker", "power", "lights", "voltage"]
    ):
        return {
            "category": "electrical",
            "sub_category": "power",
            "urgency": "high",
            "department": "maintenance",
            "emergency": False,
            "tenant_summary": "The request appears related to an electrical issue.",
            "staff_recommendation": (
                "Assign an electrical maintenance technician immediately."
            ),
        }

    if any(
        word in lowered
        for word in ["roach", "rats", "mice", "bugs", "pest", "infestation"]
    ):
        return {
            "category": "pest_control",
            "sub_category": "pests",
            "urgency": "medium",
            "department": "vendor",
            "emergency": False,
            "tenant_summary": "The request appears related to pest control.",
            "staff_recommendation": "Schedule pest control vendor inspection.",
        }

    if any(
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
        return {
            "category": "appliance",
            "sub_category": "in_unit",
            "urgency": "medium",
            "department": "maintenance",
            "emergency": False,
            "tenant_summary": "The request appears related to an appliance issue.",
            "staff_recommendation": (
                "Assign appliance maintenance technician for review."
            ),
        }

    return {
        "category": "general",
        "sub_category": "unspecified",
        "urgency": "medium",
        "department": "property_management",
        "emergency": False,
        "tenant_summary": "The maintenance request has been categorized for review.",
        "staff_recommendation": (
            "Review the issue and assign to the appropriate team."
        ),
    }
