import { Box, Button, VStack, Text, useToast } from '@chakra-ui/react';
import { FaGoogle, FaGithub, FaFacebook } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const { socialSignIn } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSocialLogin = async (provider) => {
    try {
      await socialSignIn(provider);
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Unable to sign in. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
    >
      <VStack spacing={4} p={8} bg="white" borderRadius="lg" boxShadow="lg">
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Welcome to Task Manager
        </Text>
        <Button
          leftIcon={<FaGoogle />}
          colorScheme="red"
          width="full"
          onClick={() => handleSocialLogin('google')}
        >
          Continue with Google
        </Button>
        <Button
          leftIcon={<FaGithub />}
          colorScheme="gray"
          width="full"
          onClick={() => handleSocialLogin('github')}
        >
          Continue with GitHub
        </Button>
        <Button
          leftIcon={<FaFacebook />}
          colorScheme="facebook"
          width="full"
          onClick={() => handleSocialLogin('facebook')}
        >
          Continue with Facebook
        </Button>
      </VStack>
    </Box>
  );
};
