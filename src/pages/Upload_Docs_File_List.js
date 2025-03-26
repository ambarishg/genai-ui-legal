import React from 'react';
import { Box } from '@chakra-ui/react';
import FileUpload from '../pages/UploadDocs';
import FileList from './FileList';

const UploadDocsFileList = () => {
  return (
   <span>
      <Box mb={8}>
        <FileUpload />
      </Box>
      <Box mb={8}>
        {/* Display the list of uploaded files */}
        <FileList />
      </Box>
   </span>
  );
};

export default UploadDocsFileList;

