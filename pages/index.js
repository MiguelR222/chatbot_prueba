import { useState, useEffect } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [assistantId, setAssistantId] = useState(null);
  const [threadId, setThreadId] = useState(null);

  useEffect(() => {
    const fetchAssistantAndThread = async () => {
      try {
        const assistantResponse = await fetch('/api/chat', { method: 'POST' });
        const assistant = await assistantResponse.json();
        setAssistantId(assistant.assistantId);

        const threadResponse = await fetch('/api/thread', { method: 'POST' });
        const thread = await threadResponse.json();
        setThreadId(thread.threadId);

        console.log("Assistant ID:", assistant.assistantId);
        console.log("Thread ID:", thread.threadId);
      } catch (error) {
        console.error('Error fetching assistant or thread:', error);
        setChat(prev => [...prev, { role: 'bot', content: 'Error fetching assistant or thread.' }]);
      }
    };

    fetchAssistantAndThread();
  }, []);

  const handleSend = async () => {
    if (input.trim() === '' || !threadId || !assistantId) return;

    setChat(prev => [...prev, { role: 'user', content: input }]);

    try {
      await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ threadId, role: 'user', content: input }),
      });

      let response = await fetch('/api/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ threadId, assistantId }),
      });

      if (response.ok) {
        try {
          const message = await fetch(`/api/getMessage?threadId=${threadId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          const messageData = await message.json();
          console.log("Message data fetched:", messageData);
          setChat(prev => [...prev, { role: 'bot', content: messageData.result }]);
        } catch (error) {
          console.error('Error retrieving message:', error);
          setChat(prev => [...prev, { role: 'bot', content: 'Error retrieving message.' }]);
        }
      } else {
        setChat(prev => [...prev, { role: 'bot', content: 'Error retrieving response from OpenAI.' }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setChat(prev => [...prev, { role: 'bot', content: 'Error sending message.' }]);
    }

    setInput('');
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-100">
      <div className="flex-grow p-4 overflow-y-auto">
        {chat.map((msg, index) => (
          <div key={index} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-white border-t border-gray-300 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          <svg data-name="1-Arrow Up" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6">
            <path d="m26.71 10.29-10-10a1 1 0 0 0-1.41 0l-10 10 1.41 1.41L15 3.41V32h2V3.41l8.29 8.29z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

