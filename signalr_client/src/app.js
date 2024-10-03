import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider, Box  } from '@chakra-ui/react';
import Chat from './components/Chat';
import ChatPage from './components/ChatPage';

function App() {
    return (
        <ChakraProvider>
            <Router>
                <Box p={8}>
                    <Routes>
                        <Route path="/" element={<Chat />} />
                        <Route path="/chat" element={<ChatPage />} />
                    </Routes>
                </Box>
            </Router>
        </ChakraProvider>
    );
}

export default App;