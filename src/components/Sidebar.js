import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListIcon,
  Divider,
  Text,
  IconButton,
  HStack,
  VStack,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useMediaQuery,
} from '@chakra-ui/react';
import {
  AtSignIcon,
  CheckCircleIcon,
  StarIcon,
  HamburgerIcon,
} from '@chakra-ui/icons';
import { MdLogout } from 'react-icons/md'; // Import Logout icon from react-icons
import { useLogto } from '@logto/react';

const Sidebar = () => {
  const { signOut } = useLogto();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLargerThanMD] = useMediaQuery('(min-width: 768px)'); // Detects if screen is larger than medium size

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally, display an error message to the user.
    }
  };

  const sidebarContent = (
    <>
      <List spacing={3}>
        <ListItem>
          <Link to="/">
            <HStack>
              <ListIcon as={AtSignIcon} color="orange.500" />
              <Text fontWeight="medium">Home</Text>
            </HStack>
          </Link>
        </ListItem>

        <>
          <ListItem>
            <Link to="/FileUpload">
              <HStack>
                <ListIcon as={CheckCircleIcon} color="orange.500" />
                <Text fontWeight="medium">File Upload</Text>
              </HStack>
            </Link>
          </ListItem>

          <Divider borderColor="orange.200" />

          <ListItem>
            <Link to="/chat">
              <HStack>
                <ListIcon as={StarIcon} color="orange.500" />
                <Text fontWeight="medium">Chat</Text>
              </HStack>
            </Link>
          </ListItem>

          <ListItem>
            <Link to="/chat-search">
              <HStack>
                <ListIcon as={StarIcon} color="orange.500" />
                <Text fontWeight="medium">Research Assistant</Text>
              </HStack>
            </Link>
          </ListItem>

          <Divider borderColor="orange.200" />

          {/* Logout Item */}
          <ListItem>
            <Link onClick={handleLogout}>
              <HStack>
                <ListIcon as={MdLogout} color="orange.500" /> {/* Use MdLogout */}
                <Text fontWeight="medium" color="orange.500">Logout</Text> {/* Red text for logout */}
              </HStack>
            </Link>
          </ListItem>
        </>
      </List>
    </>
  );

  return (
    <>
      {isLargerThanMD ? (
        // Desktop Sidebar
        <Box
          as="nav"
          position="fixed"
          left="0"
          top="0"
          height="100vh"
          width="220px"
          bg="orange.50" // Light orange background
          color="gray.700"
          borderRight="1px solid"
          borderColor="orange.200" // Border color matching the theme
          padding="4"
        >
          <VStack align="start" spacing="5">
            <Text fontSize="lg" fontWeight="bold" color="orange.600"> {/* Darker orange for the title */}
              Legal App
            </Text>
            {sidebarContent}
          </VStack>
        </Box>
      ) : (
        // Mobile Sidebar
        <>
          <IconButton
            icon={<HamburgerIcon />}
            onClick={onOpen}
            aria-label="Open Menu"
            position="fixed"
            top="1rem"
            left="1rem"
            zIndex="10"
            colorScheme="orange" // Button color scheme
          />

          <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay>
              <DrawerContent bg="orange.50"> {/* Light orange background for drawer */}
                <DrawerCloseButton />
                <VStack align="start" spacing="5" p="4">
                  <Text fontSize="lg" fontWeight="bold" color="orange.600">
                    My App
                  </Text>
                  {sidebarContent}
                </VStack>
              </DrawerContent>
            </DrawerOverlay>
          </Drawer>
        </>
      )}
    </>
  );
};

export default Sidebar;
