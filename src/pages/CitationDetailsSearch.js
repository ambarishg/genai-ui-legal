import React from 'react';
import {
  Box,
  Heading,
  List,
  ListItem,
  Container,
  Text,
  Stack,

  useColorModeValue,
} from '@chakra-ui/react';


function CitationDetailsSearch({ search_results }) {
  const hasCitations = search_results && search_results.length > 0;
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const resultTextColor = useColorModeValue('gray.700', 'gray.300');

  return (
    <Container maxW="container.md" py={12}>
      <Stack spacing={8}>
        <Heading
          as="h2"
          size="xl"
          fontWeight="extrabold"
          textAlign="center"
          color={useColorModeValue('gray.900', 'white')}
        >
          Citation Details
        </Heading>

        {hasCitations ? (
          <List spacing={6}>
            {search_results.map((link, idx) => (
              <ListItem
                key={idx}
                borderBottom="1px solid"
                borderColor={borderColor}
                pb={4}
              >
                <Stack spacing={2}>
                  <Text fontSize="md" color={resultTextColor}>
                    {search_results && search_results[idx]
                      ? search_results[idx]
                      : `Result ${idx + 1}`}
                  </Text>
                  
                  
                </Stack>
              </ListItem>
            ))}
          </List>
        ) : (
          <Box textAlign="center">  
            <Text fontSize="lg">No citations available.</Text>
          </Box>
        )}
      </Stack>
    </Container>
  );
}

export default CitationDetailsSearch;
