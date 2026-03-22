from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import User, Conversation, Message
from app.schemas.schemas import ChatRequest
from app.services.chat_service import ChatService
import json

router = APIRouter()


# ── GET conversations (sidebar list) ──────────────────────────────────────────
@router.get("/conversations")
async def get_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conversations = (
        db.query(Conversation)
        .filter(Conversation.user_id == current_user.id)
        .order_by(Conversation.created_at.desc())
        .all()
    )
    return [
        {
            "id": str(c.id),
            "title": c.title,
            "created_at": c.created_at,
        }
        for c in conversations
    ]


# ── GET messages for a conversation ───────────────────────────────────────────
@router.get("/{conversation_id}/messages")
async def get_messages(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id,
        )
        .first()
    )
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    messages = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at)
        .all()
    )
    return [
        {
            "id": str(m.id),
            "role": m.role,
            "content": m.content,
            "citations": m.citations,
            "created_at": m.created_at,
            "chatId": str(m.conversation_id),
        }
        for m in messages
    ]


# ── POST /chat/ (streaming) ────────────────────────────────────────────────────
@router.post("/")
async def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Resolve or create conversation
    if request.conversation_id:
        conversation = (
            db.query(Conversation)
            .filter(
                Conversation.id == request.conversation_id,
                Conversation.user_id == current_user.id,
            )
            .first()
        )
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        conversation = Conversation(
            user_id=current_user.id,
            title=request.message[:50],
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)

    # Save user message
    user_msg = Message(
        conversation_id=conversation.id,
        role="user",
        content=request.message,
    )
    db.add(user_msg)
    db.commit()

    # Build history
    history = [
        {"role": m.role, "content": m.content}
        for m in db.query(Message)
        .filter(Message.conversation_id == conversation.id)
        .order_by(Message.created_at)
        .all()
    ]

    async def event_stream():
        yield json.dumps({"conversation_id": str(conversation.id)}) + "\n"
        async for token in ChatService.stream_legal_response(
            db, request.message, conversation.id, history
        ):
            yield token

    return StreamingResponse(event_stream(), media_type="text/plain")