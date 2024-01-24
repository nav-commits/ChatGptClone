import React, { useState } from 'react';
import './App.css';
import './ChatInput.css';

function App() {
    const apiKey = process.env.REACT_APP_API_KEY;
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([
        {
            role: 'user',
            message: 'who are you?',
        },
        {
            role: 'assistant',
            message: 'How can i help you today?',
        },
    ]);

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSend = () => {
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization:
                    `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                response_as_dict: true,
                attributes_as_list: false,
                show_original_response: false,
                temperature: 0,
                max_tokens: 1000,
                providers: 'openai',
                text: message,
            }),
        };

        fetch('https://api.edenai.run/v2/text/chat', options)
            .then((response) => response.json())
            .then((response) => {
                const newChat = response['openai']['message'].map((msg) => ({
                    role: msg['role'],
                    message: msg['message'],
                }));

                setChat([...chat, ...newChat]);
            })
            .catch((err) => console.error(err));

        setMessage('');
    };

    console.log(chat);

    const renderChat = () => {
        return chat.map((chatItem, index) => (
            <div key={index} className='chat'>
                <img
                    className='chat-image'
                    src={
                        chatItem.role === 'user'
                            ? 'https://media.licdn.com/dms/image/C4D03AQEQSPPTVT6-Ow/profile-displayphoto-shrink_800_800/0/1519322313224?e=2147483647&v=beta&t=56q0pQoFIH9gv-dEwJqx0dtAv-sDhYjoVRI02ekbPmU'
                            : 'https://freelogopng.com/images/all_img/1681039084chatgpt-icon.png'
                    }
                    alt={chatItem.role}
                    style={{ borderRadius: '50%' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <p style={{ color: 'white' }}>{chatItem.role}</p>
                    <p style={{ color: 'white' }}>{chatItem.message}</p>
                </div>
            </div>
        ));
    };

    return (
        <div className='App'>
            <div className='sidebar'>
                <h1>Welcome to Nav GPT</h1>
                <div className='sidebar-item'>New Chat</div>
                <div className='sidebar-item'>Item 2</div>
                <div className='sidebar-item'>Item 3</div>
                {/* Add more items as needed */}
            </div>

            <div className='main-content'>
                <div className='chats'>{renderChat()}</div>
            </div>

            <div className='chat-input-container'>
                <textarea
                    type='text'
                    className='chat-input'
                    placeholder='Message The GPT...'
                    value={message}
                    onChange={handleInputChange}
                ></textarea>
                <button className='send-button' onClick={handleSend}>
                    <i className='icon-send'>📤</i>
                </button>
            </div>
        </div>
    );
}

export default App;
