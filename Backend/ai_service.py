import json
from typing import Any

import google.generativeai as genai

from config import settings
from schemas import SymptomRequest, SymptomResponse

genai.configure(api_key=settings.gemini_api_key)

TEXT_MODEL = "gemini-2.0-flash"
VISION_MODEL = "gemini-2.0-flash"


def _clean_json_text(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:]
    return text.strip()


def _parse_json(text: str) -> dict[str, Any]:
    try:
        return json.loads(_clean_json_text(text))
    except json.JSONDecodeError:
        return {}


def _fallback_symptom_response(symptoms: list[str]) -> dict[str, Any]:
    return {
        "severity": "moderate",
        "possible_conditions": [{"name": "common viral infection", "probability": 0.5}],
        "specialists": ["general physician"],
        "emergency_signs": "Seek immediate care if symptoms rapidly worsen, you have difficulty breathing, chest pain, or confusion.",
        "recommendation": f"Consult a doctor about: {', '.join(symptoms)}.",
    }


async def analyze_symptoms(request: SymptomRequest) -> dict[str, Any]:
    prompt = f"""You are a medical triage assistant. Analyze the following patient information.

Symptoms: {', '.join(request.symptoms)}
Age: {request.age}
Medical history: {request.medical_history or 'none reported'}

Respond ONLY with valid JSON matching exactly this structure:
{{
  "severity": "mild" | "moderate" | "severe",
  "possible_conditions": [{{"name": "condition name", "probability": 0.0}}],
  "specialists": ["specialist type"],
  "emergency_signs": "warning signs that require immediate emergency care",
  "recommendation": "short next-step advice"
}}"""
    try:
        model = genai.GenerativeModel(TEXT_MODEL)
        response = await model.generate_content_async(prompt)
        result = _parse_json(response.text)
        if not result:
            return _fallback_symptom_response(request.symptoms)
        return result
    except Exception:
        return _fallback_symptom_response(request.symptoms)


async def analyze_document(file_bytes: bytes, mime_type: str, doc_type: str) -> dict[str, Any]:
    prompt = f"""You are a medical document analysis assistant. Analyze this {doc_type} document.

Respond ONLY with valid JSON matching exactly this structure:
{{
  "extracted_data": {{"key finding": "value", ...}},
  "plain_language": "simple explanation of what this document means",
  "next_steps": ["actionable step", ...]
}}"""
    try:
        model = genai.GenerativeModel(VISION_MODEL)
        response = await model.generate_content_async(
            [{"mime_type": mime_type, "data": file_bytes}, prompt]
        )
        result = _parse_json(response.text)
        if not result:
            return {
                "extracted_data": {},
                "plain_language": "The document could not be analyzed automatically. Please review it manually or try again.",
                "next_steps": ["Retry the upload", "Consult your doctor about the document"],
            }
        return result
    except Exception:
        return {
            "extracted_data": {},
            "plain_language": "The document could not be analyzed automatically. Please review it manually or try again.",
            "next_steps": ["Retry the upload", "Consult your doctor about the document"],
        }
