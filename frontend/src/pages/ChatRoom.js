import React, { useState, useEffect, useParams } from 'react';

const ChatRoom = () => {
    const { roomName } = useParams();
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const ws = new WebSocket(`ws://${window.location.host}/ws/chat/${roomName}/`);

    useEffect(() => {
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages(prevMessages => [...prevMessages, message]);
        };
        return () => {
            ws.close();
        };
    }, [roomName]); 

    const sendMessage = () => {
        const message = { message: messageInput };
        ws.send(JSON.stringify(message));
        setMessageInput('');
    };

    return (
        <div>
            <h1>Chat Room: {roomName}</h1>
            <div>
            {messages.map((message, index) => (
                <div key={index}>{message.content}</div>
            ))}
            </div>
            <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatRoom;
