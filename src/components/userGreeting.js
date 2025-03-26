import React from 'react';
import { Box, Text, useBreakpointValue } from '@chakra-ui/react';
import { useUser } from '../contexts/UserContext';

const UserGreeting = () => {
  const user = useUser();

  // Determine the user name based on the user's claims
  let userName;
  if (!user || !user.claims || !user.claims.email) {
    userName = "Guest";
  } else {
    userName = user.claims.email;
  }

  // Responsive font size
  const fontSize = useBreakpointValue({ base: 'md', md: 'lg' });

  return (
    <Box 
      padding="4" 
      bg="orange.50" // Light orange background for a warm feel
      color="orange.800" // Darker orange for text to ensure readability
      textAlign="right" 
      borderRadius="md" // Rounded corners for a softer look
      boxShadow="sm" // Subtle shadow for depth
    >
      <Text fontSize={fontSize} fontWeight="bold">
        Welcome, {userName}!
      </Text>
    </Box>
  );
};

export default UserGreeting;
