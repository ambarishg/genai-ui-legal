// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import theme from './theme'; // import your custom theme
import Home from './pages/Home';
import UploadDocsFileList from './pages/Upload_Docs_File_List';
import ChatPage from './pages/Chat';
import Sidebar from './components/Sidebar';
import Callback from './pages/CallBack';
import ProtectedRoute from './components/ProtectedRoute';
import { LogtoProvider } from '@logto/react';
import { UserScope } from '@logto/react';
import { UserProvider } from './contexts/UserContext';
import UserGreeting from './components/userGreeting';
import config from './config';
import ChatSearchPage from './pages/Chat_SEARCH';

const LogtoConfigVALUES = {
  endpoint: config.LOGTO_ENDPOINT,
  appId: config.LOGTO_APPID,
  scopes: [UserScope.Email, UserScope.Profile],
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      
      <LogtoProvider config={LogtoConfigVALUES}>
        <UserProvider>
          <Router>
            <div>
              <UserGreeting />
              <Sidebar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Home />} />
                <Route path="/callback" element={<Callback />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/FileUpload" element={<UploadDocsFileList/>} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/chat-search" element={<ChatSearchPage />} />

                </Route>
              </Routes>
            </div>
          </Router>
        </UserProvider>
        </LogtoProvider>
        
    </ChakraProvider>
  );
}

export default App;
