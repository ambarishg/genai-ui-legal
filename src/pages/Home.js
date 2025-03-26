import React from 'react';
import { Box, Heading, Text, VStack, Button, useBreakpointValue } from '@chakra-ui/react';
import { useLogto } from '@logto/react';
import config from '../config';
import { useUser } from '../contexts/UserContext';

const Home = () => {
  const { signIn, signOut } = useLogto();
  const URL = config.CALLBACK_URL;

  const user = useUser();
  let isAuthenticated = false;

  if (user) {
    if (user.claims?.email) {
      isAuthenticated = true;
    }
  }

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLogin = async () => {
    try {
      await signIn(URL);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Box
      minH="100vh"
      bg="gray.800" // Changed background color for a more professional look
      display="flex"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      color="white"
      px={6}
    >
      <VStack spacing={8} maxW={{ base: '90%', md: '600px' }} p={6} borderRadius="lg" boxShadow="xl" bg="gray.900">
        <Heading as="h1" size={useBreakpointValue({ base: 'xl', md: '2xl' })} fontWeight="bold">
          Welcome to Legal App
        </Heading>
        <Text fontSize={useBreakpointValue({ base: 'md', md: 'lg' })}>
          {isAuthenticated
            ? 'Your trusted partner for all your research needs.'
            : 'Please sign in to access all features.'}
        </Text>
        {isAuthenticated ? (
          <Button onClick={handleLogout} colorScheme="red" size="lg" variant="outline">
            Logout
          </Button>
        ) : (
          <Button onClick={handleLogin} colorScheme="blue" size="lg">
            Login
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default Home;
