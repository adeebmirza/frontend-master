import React, { useState } from "react";
import { MessageList, Input, Button } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import { FaPaperPlane } from "react-icons/fa";

function Bot() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      position: "right",
      type: "text",
      text: inputValue,
      date: new Date(),
      style: { 
        backgroundColor: "#d1d1d1", 
        color: "black", 
        borderRadius: "12px", 
        padding: "12px", 
        maxWidth: "75%", 
        margin: "8px 0",
        fontFamily: "'Inter', sans-serif",
      },
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/livechat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputValue }),
      });

      if (!response.ok) throw new Error("Failed to fetch response");

      const data = await response.json();
      const botMessage = {
        position: "left",
        type: "text",
        text: data.message,
        date: new Date(),
        style: { 
          backgroundColor: "#e6f0fa", 
          color: "black", 
          borderRadius: "12px", 
          padding: "12px", 
          maxWidth: "75%", 
          margin: "8px 0",
          fontFamily: "'Inter', sans-serif",
        },
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        position: "left",
        type: "text",
        text: `Error: ${error.message}`,
        date: new Date(),
        style: { 
          backgroundColor: "#e6f0fa", 
          color: "black", 
          borderRadius: "12px", 
          padding: "12px", 
          maxWidth: "75%", 
          margin: "8px 0",
          fontFamily: "'Inter', sans-serif",
        },
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  return (
    <div className="h-screen relative">
      {/* Inline styles for react-chat-elements overrides */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
          .message-list {
            flex-grow: 1;
            overflow-y: auto;
          }
          .rce-mbox-text {
            color: black !important;
            font-family: 'Inter', sans-serif !important;
          }
          .rce-input {
            font-family: 'Inter', sans-serif !important;
          }
          .rce-input::placeholder {
            color: rgba(255, 255, 255, 0.7) !important;
            font-family: 'Inter', sans-serif !important;
          }
        `}
      </style>

      {/* Floating Bot Button */}
      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full px-6 py-3 text-lg font-semibold cursor-pointer shadow-xl hover:bg-blue-700 transition-all duration-200 z-[1000]"
        onClick={toggleChat}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {isChatOpen ? "Close Chat" : "Chat with Bot"}
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-[500px] h-[700px] flex flex-col border border-gray-200 rounded-2xl overflow-hidden shadow-2xl z-[999] bg-white">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
            <span className="font-semibold text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
              Stream Team
            </span>
            <button className="bg-transparent border-none text-white text-lg cursor-pointer hover:text-gray-200 transition-colors" onClick={toggleChat}>
              ✕
            </button>
          </div>
          {/* Message List */}
          <MessageList
            className="message-list flex-1 overflow-y-auto p-4 bg-gray-50"
            lockable={true}
            toBottomHeight={"100%"}
            dataSource={messages}
          />
          {/* Typing Indicator */}
          {isLoading && (
            <div 
              className="p-4 text-gray-500 text-sm text-left" 
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Bot is typing...
            </div>
          )}
          {/* Input Area */}
          <div className="flex items-center p-4 border-t border-gray-200 bg-white gap-3">
            {/* Custom Input Wrapper with Integrated Send Button */}
            <div className="relative flex-1">
              <Input
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                disabled={isLoading}
                inputStyle={{ 
                  color: "white", 
                  backgroundColor: "#333", 
                  paddingRight: "40px", 
                  borderRadius: "8px",
                  fontFamily: "'Inter', sans-serif",
                }}
                className="w-full bg-gray-800 text-white rounded-lg p-3 pr-12 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-transparent border-none text-blue-500 cursor-pointer text-lg ${isLoading ? "text-gray-400 cursor-not-allowed" : "hover:text-blue-600"} transition-colors`}
                onClick={sendMessage}
                disabled={isLoading}
              >
                <FaPaperPlane />
              </button>
            </div>
            {/* External Send Button */}
            <Button
              text="Send"
              onClick={sendMessage}
              disabled={isLoading}
              buttonStyle={{ 
                backgroundColor: "#007bff", 
                color: "white", 
                borderRadius: "8px",
                fontFamily: "'Inter', sans-serif",
              }}
              className={`bg-blue-600 text-white rounded-lg px-4 py-2 font-medium ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"} transition-all shadow-sm`}
            />
          </div>
          {/* Footer */}
          <div 
            className="p-3 text-xs text-gray-500 text-center bg-white border-t border-gray-100"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            This chat may be recorded, as described in our Privacy Policy.
          </div>
        </div>
      )}
    </div>
  );
}

export default Bot;