import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  Badge,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useToast,
  Spinner
} from '@chakra-ui/react';
import { FaEllipsisV, FaPlus } from 'react-icons/fa';
import { format } from 'date-fns';
import { taskService } from '../services/taskService';
import { TaskForm } from './TaskForm';

export const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTask, setEditTask] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const fetchTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch tasks',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusToggle = async (task) => {
    try {
      await taskService.updateTask(task._id, {
        status: task.status === 'Open' ? 'Complete' : 'Open',
      });
      fetchTasks();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task status',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      fetchTasks();
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    onOpen();
  };

  const handleAddNew = () => {
    setEditTask(null);
    onOpen();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <HStack justify="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          My Tasks
        </Text>
        <Button
          leftIcon={<FaPlus />}
          colorScheme="blue"
          onClick={handleAddNew}
        >
          Add Task
        </Button>
      </HStack>

      <VStack spacing={4} align="stretch">
        {tasks.map((task) => (
          <Box
            key={task._id}
            p={4}
            borderWidth={1}
            borderRadius="lg"
            bg="white"
            shadow="sm"
          >
            <HStack justify="space-between">
              <VStack align="start" spacing={1} flex={1}>
                <HStack>
                  <Text
                    fontSize="lg"
                    textDecoration={
                      task.status === 'Complete' ? 'line-through' : 'none'
                    }
                  >
                    {task.title}
                  </Text>
                  <Badge
                    colorScheme={task.status === 'Complete' ? 'green' : 'yellow'}
                  >
                    {task.status}
                  </Badge>
                </HStack>
                {task.description && (
                  <Text color="gray.600" fontSize="sm">
                    {task.description}
                  </Text>
                )}
                <Text color="gray.500" fontSize="sm">
                  Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </Text>
              </VStack>

              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<FaEllipsisV />}
                  variant="ghost"
                  size="sm"
                />
                <MenuList>
                  <MenuItem onClick={() => handleStatusToggle(task)}>
                    Mark as {task.status === 'Open' ? 'Complete' : 'Open'}
                  </MenuItem>
                  <MenuItem onClick={() => handleEdit(task)}>Edit</MenuItem>
                  <MenuItem onClick={() => handleDelete(task._id)}>
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Box>
        ))}

        {tasks.length === 0 && (
          <Box textAlign="center" py={8} color="gray.500">
            No tasks yet. Click "Add Task" to create one.
          </Box>
        )}
      </VStack>

      <TaskForm
        isOpen={isOpen}
        onClose={onClose}
        onTaskAdded={fetchTasks}
        editTask={editTask}
      />
    </Box>
  );
};
