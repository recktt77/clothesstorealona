import React, { useState } from "react";
import { query } from "../../ai/ai";
import "./ChatAssistant.css";

const ChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ sender: "bot", text: "Hello, you may ask the questions" }]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages([...messages, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const aiResponse = await query(input);
            setMessages(prevMessages => [
                ...prevMessages,
                { sender: "bot", text: `🤖 AI: ${aiResponse}` }
            ]);
        } catch (error) {
            setMessages(prevMessages => [
                ...prevMessages,
                { sender: "bot", text: "❌ error while responsing" }
            ]);
        }

        setIsLoading(false);
    };

    return (
        <div className="chat-container">
            <button className="chat-button" onClick={toggleChat}>
                💬
            </button>

            {isOpen && (
                <div className="chat-box">
                    <div className="chat-header">
                        <h3>AI assistant</h3>
                        <button className="close-button" onClick={toggleChat}>✖</button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isLoading && <div className="message bot">⏳ AI thinking...</div>}
                    </div>

                    <div className="chat-input">
                        <input
                            type="text"
                            placeholder="write the question..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button onClick={handleSendMessage} disabled={isLoading}>
                            {isLoading ? "⏳" : "🚀"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatAssistant;
