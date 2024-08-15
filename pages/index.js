import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState(''); 
  const [chat, setChat] = useState([]); 
  const [context, setContext] = useState([]); 

  const handleSend = async () => {
    if (input.trim() === '') return;

    setChat(prev => [...prev, { role: 'user', content: input }]);

    let prompt = input.toLowerCase();
    let protocolo;
    let newRequest;

    const protocoloMatch = prompt.match(/protocolo\s*(\d+)/);

    if (protocoloMatch) {
      let num = protocoloMatch[1];
      protocolo = `protocolo${num}`;

      let prevContext = context ? `${context}, ${protocolo}` : protocolo;

      setContext(prevContext);

      newRequest = {
        role: 'user',
        content: `In the string "${prevContext}", count how many times "${protocolo}" appears give only this response: "${protocolo} has been called X times."`
      };
    } else {
      newRequest = {
        role: 'user',
        content: `${prompt}`
      };
    }

    console.log('Sending request to API:', JSON.stringify({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: newRequest.content },
      ]
    }, null, 2));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: newRequest.content },
        ] }),
      });

      const data = await response.json();

      if (response.ok) {
        setChat(prev => [...prev, { role: 'bot', content: data.result }]);
      } else {
        setChat(prev => [...prev, { role: 'bot', content: 'Error: Unable to retrieve response from OpenAI.' }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setChat(prev => [...prev, { role: 'bot', content: 'Error: Unable to retrieve response.' }]);
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
        <button
          onClick={handleSend}
          className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <svg data-name="1-Arrow Up" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6">
            <path d="m26.71 10.29-10-10a1 1 0 0 0-1.41 0l-10 10 1.41 1.41L15 3.41V32h2V3.41l8.29 8.29z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
