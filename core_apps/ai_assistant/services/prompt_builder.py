def build_maintenance_triage_prompt(issue_text: str) -> str:
    return f"""
You are an AI maintenance triage assistant for an estate management platform.

Analyze the tenant maintenance request below and return ONLY valid JSON.

Tenant request:
\"\"\"{issue_text}\"\"\"

Return this JSON shape:
{{
  "category": "plumbing | electrical | hvac | appliance | safety | pest_control | general",
  "urgency": "low | medium | high | emergency",
  "department": "maintenance | property_management | emergency_services | vendor",
  "emergency": true,
  "tenant_summary": "short tenant-friendly explanation",
  "staff_recommendation": "recommended next action for staff"
}}
"""