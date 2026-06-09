# CyberSys AI Roadmap

## Overview

The AI roadmap focuses on turning CyberSys from a standard estate management system into an AI-assisted property operations platform.

The goal is to demonstrate applied AI engineering through real business workflows instead of isolated chatbot demos.

---

## Phase 1 — AI Maintenance Triage

### Goal

Automatically analyze maintenance issues and produce structured recommendations.

### Input

- Issue title
- Issue description
- Issue status
- Issue priority
- Apartment unit
- Reporting user

### Output

```json
{
  "category": "plumbing",
  "urgency": "high",
  "department": "maintenance",
  "emergency": false,
  "tenant_summary": "The request appears related to a plumbing issue.",
  "staff_recommendation": "Assign a plumbing technician for inspection and repair."
}
```

### Value

This proves the system can add AI decision support to an existing workflow.

---

## Phase 2 — AI Work Order Assistant

### Goal

Help staff understand, prioritize, and respond to maintenance issues.

### Capabilities

- Summarize issue history
- Draft tenant responses
- Suggest next action
- Recommend staff/vendor routing
- Detect duplicate or repeated problems

---

## Phase 3 — RAG Property Knowledge Assistant

### Goal

Allow tenants and staff to ask questions against property documents.

### Knowledge Sources

- Lease rules
- Property policies
- Maintenance FAQs
- HOA documents
- Emergency procedures

### Example Questions

- Can I install my own washer?
- What should I do if my AC stops working?
- Who handles pest control?
- What are the emergency maintenance rules?

---

## Phase 4 — AI Tenant Communication Assistant

### Goal

Provide a conversational interface for tenants.

### Capabilities

- Help tenants report issues
- Explain maintenance status
- Answer policy questions
- Route questions to staff when needed

---

## Phase 5 — AI Operations Dashboard

### Goal

Turn AI results into operational analytics.

### Metrics

- Open issues by urgency
- Issue categories by apartment/building
- Emergency detection rate
- Average resolution time
- Repeat maintenance patterns
- Tenant satisfaction trends

---

## Phase 6 — LLM Provider Integration

### Goal

Replace the rule-based prototype with configurable AI providers.

### Providers

- OpenAI
- Gemini
- Local LLM through Ollama

### Requirements

- Environment-based provider selection
- JSON response validation
- Safe fallback behavior
- Prompt logging controls
- No API keys committed to Git

---

## Final AI System Goal

```
Tenant submits issue
  |
  v
AI classifies and summarizes
  |
  v
System stores AI decision
  |
  v
Staff receives recommendation
  |
  v
Dashboard shows operational intelligence
  |
  v
Future RAG assistant answers tenant/staff questions
```
