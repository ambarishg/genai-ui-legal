import React from 'react';
import {
  Box,
  Heading,
  List,
  ListItem,
  Link,
  Container,
  Text,
  Stack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaExternalLinkAlt } from 'react-icons/fa';

function CitationDetails({ citations, metadata, search_results }) {
  const hasCitations = citations && citations.length > 0;
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const linkTextColor = useColorModeValue('teal.500', 'teal.300');
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
            {citations.map((link, idx) => (
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
                  <Link
                    href={link}
                    color={linkTextColor}
                    isExternal
                    fontWeight="semibold"
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    {metadata && metadata[idx]
                      ? metadata[idx]
                      : `Citation ${idx + 1}`}
                    <Icon as={FaExternalLinkAlt} boxSize={4} />
                  </Link>
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

export default CitationDetails;
