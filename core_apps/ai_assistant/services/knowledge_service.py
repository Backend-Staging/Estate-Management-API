import re
from typing import Any

from django.db.models import Q

from core_apps.ai_assistant.models import PropertyKnowledgeArticle

from .llm_client import llm_complete


def _tokenize(text: str) -> set[str]:
    return {
        word
        for word in re.findall(r"[a-z0-9']+", text.lower())
        if len(word) > 2
    }


def _score_article(question_tokens: set[str], article: PropertyKnowledgeArticle) -> float:
    content_tokens = _tokenize(f"{article.title} {article.content}")
    if not question_tokens:
        return 0.0
    overlap = question_tokens & content_tokens
    return len(overlap) / len(question_tokens)


class KnowledgeAssistantService:

    def search(self, question: str, *, building: str = "", limit: int = 3) -> list[dict]:
        question_tokens = _tokenize(question)
        queryset = PropertyKnowledgeArticle.objects.filter(is_active=True)

        if building:
            queryset = queryset.filter(Q(building="") | Q(building__iexact=building))

        scored: list[tuple[float, PropertyKnowledgeArticle]] = []
        for article in queryset:
            score = _score_article(question_tokens, article)
            if score > 0:
                scored.append((score, article))

        scored.sort(key=lambda item: item[0], reverse=True)
        if not scored:
            scored = [(0.1, article) for article in queryset[:limit]]

        results = []
        for score, article in scored[:limit]:
            excerpt = article.content[:400].strip()
            if len(article.content) > 400:
                excerpt += "…"
            results.append(
                {
                    "slug": article.slug,
                    "title": article.title,
                    "category": article.category,
                    "excerpt": excerpt,
                    "score": round(score, 2),
                }
            )
        return results

    def answer(self, question: str, *, building: str = "") -> dict[str, Any]:
        sources = self.search(question, building=building, limit=3)
        context = "\n\n".join(
            f"## {source['title']}\n{source['excerpt']}" for source in sources
        )

        synthesized = None
        if context:
            synthesized = llm_complete(
                f"""Answer the tenant question using ONLY the property knowledge below.
If the answer is not in the documents, say you are not sure and suggest contacting building staff.

Question: {question}

Property knowledge:
{context}
""",
                system=(
                    "You are a helpful property knowledge assistant for apartment residents. "
                    "Be concise, friendly, and practical."
                ),
            )

        if not synthesized and sources:
            synthesized = (
                f"Based on our property guidelines ({sources[0]['title']}): "
                f"{sources[0]['excerpt']}"
            )
        elif not synthesized:
            synthesized = (
                "I could not find a specific policy for that question. "
                "Please contact building management or submit a maintenance request."
            )

        return {
            "question": question,
            "answer": synthesized.strip(),
            "sources": sources,
        }
