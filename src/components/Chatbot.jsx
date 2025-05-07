import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://api.intellihelper.tech';

const Chatbot = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]); // Initialize as an empty array
  const [threadId, setThreadId] = useState(null);
  const [allChats, setAllChats] = useState([]);
  const [newThreadName, setNewThreadName] = useState('');
  const [error, setError] = useState('');
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedMode = localStorage.getItem('darkMode');
    return storedMode === 'true' || (!storedMode && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Initial state: collapsed

  const token = localStorage.getItem('token');

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    if (!token) {
      setError('User not authenticated. Please log in.');
      navigate('/auth/login');
    }
  }, [navigate, token]);

  useEffect(() => {
    fetchModels();
    if (threadId) {
      fetchChatHistory(threadId);
    }
  }, [threadId]);

  const fetchModels = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/models`, axiosConfig);
      setModels(response.data.models);
      if (response.data.models.length > 0 && !selectedModel) {
        setSelectedModel(response.data.models[0]);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const fetchChatHistory = async (currentThreadId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/history/${currentThreadId}`, axiosConfig);
      // Check if response.data is an array before setting state
      if (Array.isArray(response.data)) {
        setChatHistory(response.data);
      } else {
        setChatHistory([]); // Or handle the error appropriately
        console.error("fetchChatHistory: Response data is not an array", response.data);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setChatHistory([]);
      } else {
        handleError(error);
      }
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedModel) return;

    let activeThreadId = threadId;
    if (!threadId && newThreadName.trim()) {
      activeThreadId = newThreadName.trim();
      setThreadId(activeThreadId);
      setNewThreadName('');
    }

    const userMessage = {
      message: message.trim(),
      response: null,
      sending: true,
    };

    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');

    try {
      const response = await axios.post(
        `${API_BASE_URL}/chat`,
        { message: userMessage.message, model: selectedModel, thread_id: activeThreadId },
        axiosConfig
      );
      // Check if response.data.chat_history is an array
      if (response.data && Array.isArray(response.data.chat_history)) {
        setChatHistory(response.data.chat_history);
      } else {
        setChatHistory([]); // Or handle as needed.
        console.error("sendMessage: chat_history is not an array", response.data);
      }
      setThreadId(response.data.thread_id);
    } catch (error) {
      handleError(error);
    }
  };

  const deleteChat = async (chatThreadId) => {
    if (!window.confirm(`Are you sure you want to delete chat "${chatThreadId}"?`)) return;
    try {
      const response = await axios.delete(`${API_BASE_URL}/chat/${chatThreadId}`, axiosConfig);
      alert(response.data.message);
      setThreadId(null);
      setChatHistory([]);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchAllChats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chats`, axiosConfig);
      setAllChats(response.data.chats);
    } catch (error) {
      handleError(error);
    }
  };
  

  const createNewChat = async () => {
    const name = prompt('Enter a name for your new chat:');
    if (name) {
      setChatHistory([]); // Clear the chat history
      setThreadId(null);  // Clear the current thread
      setNewThreadName(name.trim()); // Set the new thread name
  
      // Now fetch all chats to include the newly created chat
      await fetchAllChats();
    }
  };
  

  const handleError = (error) => {
    console.error('Request error:', error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      navigate('/auth/login');
    } else {
      setError(error.response?.data?.detail || 'An error occurred.');
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`flex flex-col h-screen font-sans ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} mx-0`}>
      {/* Header */}
      <header className={`flex justify-between items-center p-4 shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <button
          onClick={() => navigate('/')}
          className={`hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} py-2 px-4 rounded transition ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold">{isDarkMode ? 'IntelliHelper Chat' : 'IntelliHelper Chat'}</h1>
        <div className="flex space-x-3 items-center">
          <button
            onClick={createNewChat}
            className={`bg-yellow-400 hover:bg-yellow-500 ${isDarkMode ? 'text-gray-900' : 'text-gray-900'} font-semibold py-2 px-4 rounded-lg shadow transition`}
          >
            + New Chat
          </button>
          
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1m-9 0h-1m-2 9l-2-2M7 10l-2 2M15 7l2-2M9 16l2 2M4 12a8 8 0 0116 0H4z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {error && (
        <div className={`px-4 py-2 text-center text-sm ${isDarkMode ? 'bg-red-800 text-red-300' : 'bg-red-100 text-red-700'}`}>
          {error}
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-grow p-2 gap-4 overflow-hidden">
        {/* Sidebar Toggle Button (for smaller screens) */}
        <button
          onClick={toggleSidebar}
          className={`md:hidden p-2 rounded-md shadow ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
        >
          {isSidebarOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>

        {/* Chat Display */}
        <div
          ref={chatContainerRef}
          className={`flex-grow rounded-lg shadow-inner p-4 overflow-y-auto space-y-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
        >
          {/* Use a conditional check before mapping */}
          {Array.isArray(chatHistory) ? (
            chatHistory.map((msg, index) => (
              <div key={index}>
                {msg.message && (
                  <div className={`p-3 rounded-lg max-w-xl ml-auto text-sm ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-800'}`}>
                    <div className="text-right font-semibold">{isDarkMode ? 'You' : 'You'}</div>
                    <div>{msg.message}</div>
                    {msg.sending && <div className="text-xs text-gray-400 mt-1">Sending...</div>}
                  </div>
                )}
                {msg.response && (
                  <div className={`p-3 rounded-lg max-w-xl mr-auto text-sm ${isDarkMode ? 'bg-teal-600 text-white' : 'bg-teal-200 text-gray-800'}`}>
                    <div className="font-semibold">{selectedModel}</div>
                    <div>{msg.response}</div>
                  </div>
                )}
              </div>
            ))
          ) : (
            // Render something else, like a loading message, or an empty state
            <div>{chatHistory === null ? "Loading..." : "No chat history available."}</div>
          )}
        </div>

        {/* Collapsed Sidebar */}
        <aside
          className={`
            w-14 md:w-14 rounded-lg shadow-lg flex-shrink-0
            ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'}
            ${isSidebarOpen ? 'hidden md:block' : 'block'}
            flex flex-col items-center p-2 md:p-4
          `}
        >
          <button
            onClick={toggleSidebar}
            className={`w-full h-10 rounded-md shadow ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} flex items-center justify-center`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {/* You can add icons or brief indicators for other sidebar actions here if needed */}
        </aside>

        {/* Expanded Sidebar */}
<aside
  className={`
    w-full md:w-72 rounded-lg shadow-lg p-4 flex-shrink-0
    ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'}
    ${isSidebarOpen ? 'block' : 'hidden'}
  `}
>
  <div className="flex justify-end md:justify-between items-center mb-4 md:mb-0">
    <h2 className="text-lg font-bold hidden md:block">{isDarkMode ? 'Chat Options' : 'Chat Options'}</h2>
    {/* Collapse Button */}
    <button
      onClick={toggleSidebar}
      className={`p-2 rounded-md shadow ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  </div>

  {/* Sidebar Content */}
  <div className="mt-4">
    <div className="mb-4">
      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
        Select Model
      </label>
      <select
        className={`w-full border ${isDarkMode ? 'border-gray-700 bg-gray-900 text-gray-100' : 'border-gray-300 bg-white text-gray-800'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-400`}
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
      >
        {models.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>
    </div>

    {threadId && (
      <div className="mt-6">
        <h3 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Active Chat</h3>
        <p className={`text-xs truncate ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>{threadId}</p>
        <button
          onClick={() => deleteChat(threadId)}
          className="mt-2 bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded shadow"
        >
          Delete Chat
        </button>
      </div>
    )}

    {/* "View Chats" Button */}
    <div className="mt-6">
      <button
        onClick={fetchAllChats}
        className={`bg-white ${isDarkMode ? 'text-gray-900' : 'text-gray-900'} font-semibold py-2 px-4 rounded-lg shadow hover:shadow-lg transition`}
      >
        View Chats
      </button>
    </div>

    {allChats.length > 0 && (
      <div className="mt-6">
        <h3 className={`text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Chat Threads</h3>
        <ul className="space-y-2 max-h-64 overflow-y-auto text-sm">
          {allChats.map((tid) => (
            <li
              key={tid}
              className={`p-2 rounded hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} flex justify-between items-center ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}
            >
              <button
                onClick={() => setThreadId(tid)}
                className={`truncate hover:underline ${isDarkMode ? 'text-teal-300' : 'text-teal-600'}`}
              >
                {tid}
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
</aside>


      </div>

      {/* Message Input */}
      <div className={`border-t p-4 shadow-inner ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className={`flex-grow p-3 rounded-md border ${isDarkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-300 bg-white text-gray-800'} focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-sm`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 rounded-md transition shadow"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;