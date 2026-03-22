import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Send, Bot, Menu } from 'lucide-react';
import FirstMessageSection from './FIrstMessageSection';
import MessageSection from './MessageSection';
import axiosInstance from '../../api/axiosInstance';

interface Citation {
    link: string;
    source: string;
}
interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    created_at: Date;
    chatId: string;
    citations: Citation[]
}
interface Chat {
    id: string;
    title: string;
    created_at: Date;
}
interface messageInterfaceProps {
    sidebarOpen: boolean | true;
    setSidebarOpen: (value: boolean) => void;
    chats: Chat[];
    setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}

const MessageInterfaceSection = ({ sidebarOpen, setSidebarOpen, setChats }: messageInterfaceProps) => {
    const { chatId } = useParams<{ chatId: string }>();
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState<boolean>(false);

    useEffect(() => {
        inputRef.current?.focus();
        if (!chatId) return;
        const fetchMessages = async () => {
            const response = await axiosInstance.get(`/chat/${chatId}/messages`);
            setMessages(response.data);
        };
        fetchMessages();
    }, [chatId]);

    const streamChat = async (message: string, conversationId: string | null) => {
        const token = localStorage.getItem('userToken');

        setMessages(prev => [...prev, {
            id: 'temp-ai',
            content: '',
            role: 'assistant',
            chatId: conversationId ?? '',
            created_at: new Date(),
            citations: []
        }]);

        // ✅ FIXED: removed /api/v1 since VITE_BASE_URL already includes it
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/chat/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                message,
                conversation_id: conversationId ?? null
            }),
        });

        if (!response.ok) {
            console.error('Stream request failed:', response.status);
            return;
        }

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let isFirst = true;
        let fullContent = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);

            if (isFirst) {
                try {
                    const firstNewline = chunk.indexOf('\n');
                    const metaStr = firstNewline !== -1 ? chunk.slice(0, firstNewline) : chunk;
                    const meta = JSON.parse(metaStr);

                    if (meta.conversation_id) {
                        setChats(prev => {
                            const exists = prev.find(c => c.id === meta.conversation_id);
                            if (exists) return prev;
                            return [{ id: meta.conversation_id, title: message, created_at: new Date() }, ...prev];
                        });
                        navigate(`/chat/${meta.conversation_id}`, { replace: true });
                    }

                    const remainder = firstNewline !== -1 ? chunk.slice(firstNewline + 1) : '';
                    if (remainder) {
                        fullContent += remainder;
                        setMessages(prev => {
                            const updated = [...prev];
                            const lastIdx = updated.length - 1;
                            if (updated[lastIdx]?.role === 'assistant') {
                                updated[lastIdx] = { ...updated[lastIdx], content: fullContent };
                            }
                            return updated;
                        });
                    }
                } catch (_) {
                    fullContent += chunk;
                }
                isFirst = false;
            } else {
                fullContent += chunk;
                setMessages(prev => {
                    const updated = [...prev];
                    const lastIdx = updated.length - 1;
                    if (updated[lastIdx]?.role === 'assistant') {
                        updated[lastIdx] = { ...updated[lastIdx], content: fullContent };
                    }
                    return updated;
                });
            }
        }

        setIsTyping(false);
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: input,
            role: 'user',
            chatId: chatId ?? '',
            created_at: new Date(),
            citations: []
        };

        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);
        const currentInput = input;
        setInput('');

        try {
            await streamChat(currentInput, chatId ?? null);
        } catch (err) {
            console.error('Stream error:', err);
            setIsTyping(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col">
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-dark rounded-lg flex items-center justify-center">
                        <Bot className="w-5 h-5 text-text" />
                    </div>
                    <h1 className="text-lg font-semibold text-primary-dark">LegalGPT Nepal</h1>
                </div>
            </div>

            {messages.length > 0 ? (
                <MessageSection messages={messages} isTyping={isTyping} />
            ) : (
                <FirstMessageSection />
            )}

            <div className="border-t border-gray-200 bg-white px-4 pt-4 pb-2">
                <div className="max-w-3xl mx-auto">
                    <div className="flex gap-3 items-end">
                        <div className="flex-1 bg-gray-50 rounded-3xl border border-gray-200">
                            <input
                                type="text"
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about Nepal's laws..."
                                className="w-full px-5 py-3 bg-transparent focus:outline-none"
                            />
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className={`p-3 rounded-full ${input.trim() ? 'bg-primary-dark text-white' : 'bg-gray-200 text-gray-400'}`}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageInterfaceSection;