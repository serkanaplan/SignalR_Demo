import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { ToastContainer } from 'react-toastify'; // ToastContainer import edin
import 'react-toastify/dist/ReactToastify.css'; // ReactToastify stillerini import edin
import useChatStore from '../store/useChatStore';

// Renk animasyonları
const blinkAnimation = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const StatusIndicator = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-bottom: 1rem;
  background-color: ${({ status }) =>
    status === 'connected' ? 'green' :
    status === 'reconnecting' ? 'blue' :
    status === 'disconnected' ? 'red' : 'gray'};
  animation: ${blinkAnimation} 1s linear infinite;
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f4f4f8;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
`;

const MessageList = styled.ul`
  width: 100%;
  list-style-type: none;
  padding: 0;
  margin: 1rem 0;
  max-height: 300px;
  overflow-y: auto;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const MessageItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 1rem;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-right: 10px;
  outline: none;
`;

const SendButton = styled.button`
  padding: 10px 15px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

const Title = styled.h1`
  color: #333;
  font-size: 24px;
`;

const UserList = styled.div`
  width: 100%;
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const UserItem = styled.div`
  padding: 8px;
  margin-bottom: 5px;
  border-bottom: 1px solid #e0e0e0;
`;

const Chat = () => {
  const { connectToHub, users, messages, sendMessage, connectionStatus } = useChatStore();
  const [message, setMessage] = useState('');

  useEffect(() => {
    connectToHub(); // Bağlantıyı başlat
  }, [connectToHub]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage(''); // Mesajı gönderince input alanını temizle
    }
  };

  return (
    <ChatContainer>
      <ToastContainer /> {/* Toast bildirimi göstermek için ToastContainer ekleyin */}
      <Title>Chat Uygulaması</Title>
      <StatusIndicator status={connectionStatus} />
      <h3>Bağlı Kullanıcılar:</h3>
      <UserList>
        {users.map((user, index) => (
          <UserItem key={index}>{user}</UserItem>
        ))}
      </UserList>
      <MessageList>
        {messages.map((msg, index) => (
          <MessageItem key={index}>{msg}</MessageItem>
        ))}
      </MessageList>
      <InputContainer>
        <MessageInput
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Mesajınızı yazın..."
        />
        <SendButton onClick={handleSendMessage}>Gönder</SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default Chat;
