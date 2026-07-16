from typing import Any

from django.contrib.auth import get_user_model

from core_apps.ai_assistant.models import AIChatMessage

from .knowledge_service import KnowledgeAssistantService
from .llm_client import llm_complete

User = get_user_model()


class TenantCommunicationService:
    """Conversational assistant for tenant questions and issue guidance."""

    def __init__(self) -> None:
        self.knowledge = KnowledgeAssistantService()

    def respond(self, user: User, message: str) -> dict[str, Any]:
        building = ""
        profile = getattr(user, "profile", None)
        apartment = getattr(profile, "apartment", None) if profile else None
        if apartment:
            building = apartment.building

        history = list(
            AIChatMessage.objects.filter(user=user)
            .order_by("-created_at")[:6]
            .values("role", "content")
        )
        history.reverse()

        knowledge_hit = self.knowledge.answer(message, building=building)
        knowledge_context = knowledge_hit["answer"]

        transcript = "\n".join(
            f"{item['role'].upper()}: {item['content']}" for item in history
        )

        reply = llm_complete(
            f"""You are a friendly tenant communication assistant for an apartment community app.

Help the resident with maintenance guidance, building questions, and next steps.
Use the property knowledge snippet when relevant. Keep replies under 120 words.

Property knowledge snippet:
{knowledge_context}

Conversation so far:
{transcript}

Tenant message:
{message}
""",
            system=(
                "Be warm, clear, and practical. If something sounds like an emergency, "
                "tell them to call 911 first."
            ),
        )

        if not reply:
            reply = knowledge_context

        AIChatMessage.objects.create(
            user=user, role=AIChatMessage.Role.USER, content=message
        )
        AIChatMessage.objects.create(
            user=user,
            role=AIChatMessage.Role.ASSISTANT,
            content=reply,
            metadata={"sources": knowledge_hit.get("sources", [])},
        )

        return {
            "message": message,
            "reply": reply.strip(),
            "sources": knowledge_hit.get("sources", []),
        }
