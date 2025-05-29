import {
  Box,
  Container,
  Flex,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { TaskList } from './TaskList';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Box bg="white" py={4} shadow="sm">
        <Container maxW="container.lg">
          <Flex justify="space-between" align="center">
            <Text fontSize="2xl" fontWeight="bold" color="blue.600">
              Task Manager
            </Text>
            
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                rightIcon={
                  <Avatar
                    size="sm"
                    name={user?.name}
                    src={user?.picture}
                  />
                }
              >
                {user?.name}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.lg" py={8}>
        <TaskList />
      </Container>
    </Box>
  );
};
