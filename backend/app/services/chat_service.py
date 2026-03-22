from sqlalchemy.orm import Session
from app import models
from app.services.ai_service import ai_service
from uuid import UUID
from typing import AsyncGenerator

class ChatService:

    # --- keep your existing method as-is ---
    @staticmethod
    async def get_legal_response(db: Session, message: str, conversation_id: UUID):
        ...  # unchanged

    # --- ADD this new streaming method ---
    @staticmethod
    async def stream_legal_response(
        db: Session,
        message: str,
        conversation_id: UUID,
        history_msgs: list,
    ) -> AsyncGenerator[str, None]:
        """
        Streams tokens to the caller and persists the
        completed message to the DB once the stream ends.
        """
        full_content = []

        async for chunk in ai_service.get_model_stream(message, history_msgs):
            full_content.append(chunk)
            yield chunk          # ← pushes each token to the HTTP response

        # ── After stream ends, persist to DB ──────────────────────────────
        ai_msg = models.Message(
            conversation_id=conversation_id,
            role="assistant",
            content="".join(full_content),
            citations=None,
        )
        db.add(ai_msg)
        db.commit()