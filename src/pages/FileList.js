import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Flex,
  IconButton,
  Spinner,
  Text,
  Input,
  Link,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { FaFileAlt, FaTag, FaCheckCircle, FaClipboardList } from 'react-icons/fa';
import config from '../config';
import UniqueIdComponent from '../components/UniqueIdComponent';
import { useUser } from '../contexts/UserContext';

const URL = config.SERVER_URL;
const URL_ANALYSIS = `${URL}/get_files_indexed/`;
const URL_SUMMARIZE = `${URL}/summarize/`; // Replace with your summarize API endpoint

const FileList = () => {
  const [filesList, setFilesList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [summarizeStatusList, setSummarizeStatusList] = useState([]);
  const [summarizeURLList, setSummarizeURLList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const token = window.sessionStorage.getItem('uniqueId');
  const user = useUser();
  const user_id = user.userID;

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(URL_ANALYSIS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: user.userID }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      setFilesList(data.file_list || []);
      setCategoryList(data.category_list || []);
      setSummarizeStatusList(data.summarize_status_list || []);
      setSummarizeURLList(data.summarize_URL_list || []);
      setStatusList(data.status_list || []);
    } catch (error) {
      console.error(error);
      setError('Error fetching files');
    } finally {
      setLoading(false);
    }
  }, [token, user.userID]);

  // Function to call the REST API for summarizing a file
  const handleSummarizeFile = async (filename,category,user_id) => {
    try {
      const response = await fetch(URL_SUMMARIZE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          "file_name":filename,
          "category":category,
          "user_id":user_id }),
      });
      if (!response.ok) {
        throw new Error('Failed to summarize file');
      }
      const result = await response.json();
      console.log(`Summary for ${filename}:`, result);
      fetchFiles();
    } catch (error) {
      console.error('Error summarizing file:', error);
      alert(`Failed to summarize file: ${filename}`);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredFiles = filesList.filter((file) =>
    file.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box ml="210px" p="5">
      <UniqueIdComponent />
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading mb={6}>Uploaded Files</Heading>
        <IconButton
          colorScheme="orange"
          aria-label="Refresh List"
          icon={<RepeatIcon />}
          onClick={fetchFiles}
          size="lg"
          variant="outline"
        />
      </Flex>
      <Input
        placeholder="Search files..."
        value={searchQuery}
        onChange={handleSearchChange}
        mb={4}
        aria-label="Search files"
      />
      {loading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : filteredFiles.length === 0 ? (
        <Text>No files found.</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th bg="orange.500" color="white" py={3}>
                <Flex alignItems="center">
                  <FaFileAlt style={{ marginRight: '8px' }} /> File Name
                </Flex>
              </Th>
              <Th bg="orange.500" color="white" py={3}>
                <Flex alignItems="center">
                  <FaTag style={{ marginRight: '8px' }} /> Category
                </Flex>
              </Th>
              <Th bg="orange.500" color="white" py={3}>
                <Flex alignItems="center">
                  <FaCheckCircle style={{ marginRight: '8px' }} /> Indexing Status
                </Flex>
              </Th>
              <Th bg="orange.500" color="white" py={3}>
                <Flex alignItems="center">
                  <FaClipboardList style={{ marginRight: '8px' }} /> Summary File List
                </Flex>
              </Th>
              <Th bg="orange.500" color="white" py={3}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredFiles.map((file, index) => (
              <Tr key={index}>
                <Td>{file}</Td>
                <Td>{categoryList[index] || 'Unknown'}</Td>
                <Td>{statusList[index] || ''}</Td>
                <Td>
                {summarizeURLList[index] ? (
                  <Link href={summarizeURLList[index]} target="_blank" rel="noopener noreferrer">
                    summary - {file}
                  </Link>
                ) : (
                  <Text>{summarizeStatusList[index] || 'No summary available'}</Text>
                )}
              </Td>
                <Td>
                  {/* Summarize Button */}
                  <IconButton
                      icon={<FaClipboardList />}
                      colorScheme="orange"
                      aria-label={`Summarize ${file}`}
                      onClick={() => handleSummarizeFile(file,
                        categoryList[index],user_id)}
                      size="sm"
                      variant="solid"
                      _hover={{ bg: "orange.600", transform: "scale(1.05)" }}
                      _active={{ bg: "orange.700", transform: "scale(0.95)" }}
                    />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default FileList;
