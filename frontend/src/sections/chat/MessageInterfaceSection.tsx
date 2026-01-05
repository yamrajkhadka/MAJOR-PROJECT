import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
//icons
import { Send, Bot, Menu, } from 'lucide-react';
//sections
import FirstMessageSection from './FIrstMessageSection';
import MessageSection from './MessageSection';
//dummy datas
import testMessages from '../../dummy/testmessages';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    chatId: string;
}
interface Chat {
    id: string;
    title: string;
    timestamp: Date;
}

interface messageInterfaceProps {
    sidebarOpen: boolean | true;
    setSidebarOpen: (value: boolean) => void;
    chats: Chat[];
    setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}


const MessageInterfaceSection = ({ sidebarOpen, setSidebarOpen, setChats }: messageInterfaceProps) => {
    const { chatId } = useParams<{ chatId: string }>();

    useEffect(() => {
        //function to fetch chat when activeChatId changes:
        const newMessages = testMessages.filter((test: any) => test.chatId === chatId)
        if (newMessages[0])
            setMessages(newMessages[0].messages)
        else
            setMessages([])

    }, [chatId])
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState<boolean>(false);


    //Handle sumbit prompt
    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            chatId: chatId || '1',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);
        if (messages.length < 1) {
            setChats((prevChats: Chat[]) =>
                prevChats.map((chat) => chat.id == chatId ? { ...chat, title: input } : chat)
            )
        }
        setTimeout(() => {
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: `Thank you for your question regarding "${input}". Based on Nepal's legal framework, I can provide guidance on this matter. According to the relevant provisions in Nepal's Civil Code and Constitution, here are the key points you should know...`,
                sender: 'bot',
                chatId: chatId || '1',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
        }, 2000);
    };


    return (<>
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-gray-600 hover:text-gray-900 transition p-2 hover:bg-gray-100 rounded-lg"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-dark rounded-lg flex items-center justify-center">
                        <Bot className="w-5 h-5 text-text" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-primary-dark">LegalGPT Nepal</h1>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            {
                messages.length > 0 ? <MessageSection messages={messages} isTyping={isTyping} />
                    :
                    <FirstMessageSection />
            }


            {/* Input Area */}
            <div className="border-t border-gray-200 bg-white px-4 pt-4 pb-2">
                <div className="max-w-3xl mx-auto">
                    <div className="flex gap-3 items-end">
                        <div className="flex-1 bg-gray-50 rounded-3xl border border-gray-200 focus-within:border-primary focus-within:shadow-sm transition">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                placeholder="Ask about Nepal's laws, regulations, legal procedures..."
                                className="w-full px-5 py-3 bg-transparent focus:outline-none text-gray-800 placeholder-gray-400 text-[15px]"
                            />
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className={`p-3 rounded-full transition flex items-center justify-center ${input.trim()
                                ? 'bg-primary-dark hover:bg-primary text-white'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">
                        LegalGPT can make mistakes. Please verify important information.
                    </p>
                </div>
            </div>
        </div>
    </>
    )
}

export default MessageInterfaceSection