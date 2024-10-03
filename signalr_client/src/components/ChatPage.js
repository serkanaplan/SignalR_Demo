import React, { useState, useEffect, useRef } from 'react';
import { Box, VStack, Input, Button, Text, Heading, useToast } from '@chakra-ui/react';
import * as signalR from '@microsoft/signalr';

function ChatPage() {
    const [user, setUser] = useState('');
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const connectionRef = useRef(null);
    const toast = useToast();

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:5000/myhub')
            .withAutomaticReconnect()
            .build();

        connectionRef.current = newConnection;

        newConnection.start()
            .then(() => {
                toast({
                    title: "Connected to chat",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                });
            })
            .catch(err => {
                console.error('SignalR Connection Error: ', err);
                toast({
                    title: "Connection error",
                    description: "Could not connect to the chat server",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                });
            });

        newConnection.on('MyMessage', (user, message) => {
            setChat(prevChat => [...prevChat, { user, message }]);
        });

        return () => {
            if (connectionRef.current) {
                connectionRef.current.stop();
            }
        };
    }, [toast]);

    const sendMessage = async () => {
        if (connectionRef.current && user && message) {
            try {
                await connectionRef.current.invoke('MyMessageAsync', user, message);
                setMessage('');
            } catch (err) {
                console.error(err);
                toast({
                    title: "Error",
                    description: "Could not send message",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                });
            }
        }
    };

    return (
        <Box p={8} maxWidth="600px" margin="auto">
            <VStack spacing={4} align="stretch">
                <Heading>Real-time Chat</Heading>
                <Input
                    placeholder="Your name"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                />
                <Input
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <Button colorScheme="blue" onClick={sendMessage}>Send</Button>
                <Box borderWidth={1} borderRadius="lg" p={4} maxHeight="400px" overflowY="auto">
                    {chat.map((msg, index) => (
                        <Text key={index}>
                            <strong>{msg.user}:</strong> {msg.message}
                        </Text>
                    ))}
                </Box>
            </VStack>
        </Box>
    );
}

export default ChatPage;