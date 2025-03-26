import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  useToast,
  Heading,
  VStack,
  Text,
  Center,
  FormControl,
  FormLabel,
  Flex,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { HiCloudUpload } from 'react-icons/hi'
import UniqueIdComponent from '../components/UniqueIdComponent';
import config from '../config';
import { useUser } from '../contexts/UserContext';

const URL = config.SERVER_URL;
const URL_ANALYSIS = URL + '/upload_docs/';


const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const token = window.sessionStorage.getItem('uniqueId');
  const [category, setCategory] = useState('');
  const user = useUser();

  // Color mode values for a smooth theme transition
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const accentColor = useColorModeValue('orange.500', 'orange.300');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('category', category);
    formData.append('user_id', user.userID);

    try {
      const response = await fetch(URL_ANALYSIS, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      toast({
        title: 'File Uploaded.',
        description: `File ${selectedFile.name} uploaded successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error uploading file.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
      setCategory('');
    }
  };

  return (
    <Center py={6}>
      <UniqueIdComponent />
      <Box
        maxW="lg"
        borderWidth={1}
        borderRadius="xl" // More rounded corners
        overflow="hidden"
        p={8} // Increased padding for spaciousness
        boxShadow="2xl" // Stronger shadow for a premium feel
        bg={bgColor}
        color={textColor}
      >
        <VStack spacing={4} align="start" width="full">
          <Heading size="lg" textAlign="left" color={accentColor}>
            Upload your documents
          </Heading>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={6} align="stretch">
              {/* Category Input */}
              <FormControl id="category" isRequired>
                <FormLabel>Category</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  variant="flushed" // More subtle input style
                />
              </FormControl>

              {/* File Input */}
              <FormControl id="file" isRequired>
                <FormLabel>Select File</FormLabel>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  accept="*"
                  style={{ display: 'none' }} // Hide the default file input
                  id="file-upload" // Add an ID to the input
                />
                <Flex
                  align="center"
                  justify="space-between"
                  borderWidth="1px"
                  borderRadius="md"
                  p={2}
                  cursor="pointer"
                  borderColor="gray.300"
                  _hover={{ borderColor: accentColor }}
                  onClick={() => document.getElementById('file-upload').click()} // Trigger the hidden input
                >
                  <Text flex="1" isTruncated>
                    {selectedFile ? selectedFile.name : 'Choose a file'}
                  </Text>
                  <Icon as={HiCloudUpload} color={accentColor} ml={2} />
                </Flex>
              </FormControl>

              {/* Upload Button */}
              <Button
                type="submit"
                colorScheme="orange"
                isFullWidth
                isDisabled={!selectedFile || !category}
                isLoading={isLoading}
                rightIcon={<AddIcon />} // Add icon to the button
              >
                Upload
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Center>
  );
};

export default FileUpload;
