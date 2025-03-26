import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Input,
  Button,
  VStack,
  HStack,
  Text,
  FormControl,
  Link,
  Spinner,
  IconButton,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import DOMPurify from 'dompurify';
import { v4 as uuidv4 } from 'uuid';

import config from '../config';
import CitationDetailsSearch from './CitationDetailsSearch';
import MyModal from './MyModal';
import UniqueIdComponent from '../components/UniqueIdComponent';
import { useUser } from '../contexts/UserContext';

const URL = config.SERVER_URL;
const URL_ANALYSIS = URL + '/get_answer_from_duckduckgo/';


const SENDER_USER = 'User';
const SENDER_STUDY_APP = 'Legal App';
const SENDER_ERROR = 'Error';

const Message = React.memo(({ message, openModal, handleCopyResponse, isModalOpen, closeModal, citationDetailsId }) => {
  let bgColor;
  switch (message.sender) {
    case SENDER_USER:
      bgColor = '#FFDAB9'; // Light Peach for user messages
      break;
    case SENDER_STUDY_APP:
      bgColor = '#FFFFFF'; // White for server messages
      break;
    case SENDER_ERROR:
      bgColor = '#FFB347'; // Light Orange for error messages
      break;
    default:
      bgColor = 'gray.200';
  }

  const handleOpenModal = useCallback(() => {
    openModal(citationDetailsId);
  }, [openModal, citationDetailsId]);

  return (
    <Box
      p="2"
      bg={bgColor}
      borderRadius="md"
      mb="2"
    >
      <Text color="#333333"><strong>{message.sender}:</strong> {message.text}</Text>
      {message.sender === SENDER_STUDY_APP && message.response && (
        <>
          {/* <Text mt={2} color="#333333"><strong>Reranker Confidence:</strong> {message.response.reranker_confidence}</Text> */}
          {message.response.search_results.length > 0 && (
            <Box mt={2}>
              <Link color="teal.500" onClick={handleOpenModal}>
                Citation Details
              </Link>
            </Box>
          )}

          <MyModal isOpen={isModalOpen === citationDetailsId} onClose={closeModal} title="Citation Details">
            <CitationDetailsSearch
              search_results={message.response.search_results}
            />
          </MyModal>

          <Tooltip label="Copy Response" aria-label="Copy Response Tooltip">
            <IconButton
              icon={<CopyIcon />}
              colorScheme="green"
              size="sm"
              onClick={() => handleCopyResponse(message.text)}
              mt={2}
              variant="outline"
            />
          </Tooltip>
        </>
      )}
    </Box>
  );
});

const ChatSearchPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [conversation_id, setConversationId] = useState('');
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(null); // Changed to null
  const selectedCategory = '';
  const token = window.sessionStorage.getItem('uniqueId');
  const user = useUser();
  console.log('User:', user);

  const openModal = useCallback((citationDetailsId) => {
    setIsModalOpen(citationDetailsId);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(null);
  }, []);

     
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);



  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    setLoading(true);
    const sanitizedMessage = DOMPurify.sanitize(newMessage);

    const user_id = user.userID;

    const sqlRequest = {
      query: sanitizedMessage,
      conversation_id: conversation_id,
      category: selectedCategory,
      user_id: user_id,
    };

    const userMessage = { sender: SENDER_USER, text: sanitizedMessage };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      console.log('TOKEN:', token);

      const response = await fetch(URL_ANALYSIS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sqlRequest),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please check your credentials.');
        } else if (response.status === 404) {
          throw new Error('Resource not found. Please contact support.');
        } else {
          throw new Error(`Request failed with status: ${response.status}`);
        }
      }

      const data = await response.json();
      const citationDetailsId = uuidv4();
      const studyAppMessage = {
        sender: SENDER_STUDY_APP,
        text: data.reply,
        response: {
          URLs: data.URLs,
          metadata_source_page_to_return: data.metadata_source_page_to_return,
          search_results: data.search_results,
          reranker_confidence: data.reranker_confidence,
        },
        citationDetailsId: citationDetailsId,
      };
      setMessages((prevMessages) => [...prevMessages, studyAppMessage]);
      setConversationId(data.conversation_id);
    } catch (error) {
      console.error('Error during analysis:', error);
      const errorMessage = { sender: SENDER_ERROR, text: `An error occurred: ${error.message}` };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }

    setNewMessage('');
  };

  const handleCopyResponse = useCallback((text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "Response copied to clipboard.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }).catch(err => {
      console.error('Could not copy text: ', err);
      toast({
        title: "Error",
        description: "Failed to copy text to clipboard.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    });
  }, [toast]);

  return (
    <Box ml="210px" p="4" bg="#f0f2f5" height="100vh">
      <UniqueIdComponent />
      <Text fontSize="xl" mb={4} color="#333333">
        Research Assistant Chat
      </Text>
       <VStack spacing={4} align="stretch">
        <Box
          borderWidth="1px"
          borderRadius="lg"
          p="4"
          h="400px"
          overflowY="scroll"
          bg="#FFFFFF"
          borderColor="#E0E0E0"
          aria-live="polite"
        >
          {messages.length === 0 ? (
            <Text color="#333333">No messages yet. Start a conversation!</Text>
          ) : (
            messages.map((message, index) => (
              <Message
                key={index}
                message={message}
                openModal={openModal}
                closeModal={closeModal}
                handleCopyResponse={handleCopyResponse}
                isModalOpen={isModalOpen}
                citationDetailsId={message.citationDetailsId}
              />
            ))
          )}
          {loading && (
            <Box p="2" bg="gray.200" borderRadius="md" mb="2">
              <Spinner size="sm" /> <Text as="span" color="#333333">Processing...</Text>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        <HStack spacing={4}>
          <FormControl>
            <Input
              placeholder="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !loading) handleSendMessage();
              }}
              isDisabled={loading}
              bg="#FFFFFF"
              color="#333333"
            />
          </FormControl>
          <Button colorScheme="orange" bg="orange.500" color="white" _hover={{ bg: '#128C7E' }} onClick={handleSendMessage} isLoading={loading} isDisabled={loading}>
            Send
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ChatSearchPage;
