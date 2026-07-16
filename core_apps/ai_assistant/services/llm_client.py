import json
import logging
import re
import urllib.error
import urllib.request
from typing import Any

from django.conf import settings

logger = logging.getLogger(__name__)


def _extract_json_object(text: str) -> dict[str, Any] | None:
    """Parse the first JSON object from an LLM response."""
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                return None
    return None


def _openai_chat(prompt: str, *, system: str | None = None) -> str | None:
    api_key = getattr(settings, "OPENAI_API_KEY", "") or ""
    if not api_key:
        return None

    model = getattr(settings, "OPENAI_MODEL", "gpt-4o-mini")
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    payload = json.dumps(
        {
            "model": model,
            "messages": messages,
            "temperature": 0.2,
        }
    ).encode("utf-8")

    request = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            data = json.loads(response.read().decode("utf-8"))
            return data["choices"][0]["message"]["content"]
    except (urllib.error.URLError, KeyError, json.JSONDecodeError, TimeoutError) as exc:
        logger.warning("OpenAI request failed: %s", exc)
        return None


def _gemini_chat(prompt: str) -> str | None:
    api_key = getattr(settings, "GEMINI_API_KEY", "") or ""
    if not api_key:
        return None

    model = getattr(settings, "GEMINI_MODEL", "gemini-1.5-flash")
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{model}:generateContent?key={api_key}"
    )
    payload = json.dumps(
        {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.2},
        }
    ).encode("utf-8")

    request = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            data = json.loads(response.read().decode("utf-8"))
            return data["candidates"][0]["content"]["parts"][0]["text"]
    except (urllib.error.URLError, KeyError, json.JSONDecodeError, TimeoutError) as exc:
        logger.warning("Gemini request failed: %s", exc)
        return None


def llm_complete(prompt: str, *, system: str | None = None) -> str | None:
    provider = (getattr(settings, "AI_PROVIDER", "rules") or "rules").lower()

    if provider == "openai":
        return _openai_chat(prompt, system=system)
    if provider == "gemini":
        return _gemini_chat(prompt if not system else f"{system}\n\n{prompt}")

    if getattr(settings, "OPENAI_API_KEY", ""):
        return _openai_chat(prompt, system=system)
    if getattr(settings, "GEMINI_API_KEY", ""):
        return _gemini_chat(prompt if not system else f"{system}\n\n{prompt}")

    return None


def llm_json(prompt: str, *, system: str | None = None) -> dict[str, Any] | None:
    raw = llm_complete(prompt, system=system)
    if not raw:
        return None
    return _extract_json_object(raw)
