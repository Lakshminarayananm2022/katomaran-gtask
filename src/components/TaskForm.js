import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  useToast
} from '@chakra-ui/react';
import { taskService } from '../services/taskService';

export const TaskForm = ({ isOpen, onClose, onTaskAdded, editTask = null }) => {
  const [title, setTitle] = useState(editTask?.title || '');
  const [description, setDescription] = useState(editTask?.description || '');
  const [dueDate, setDueDate] = useState(
    editTask?.dueDate
      ? new Date(editTask.dueDate).toISOString().split('T')[0]
      : ''
  );
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const taskData = {
        title,
        description,
        dueDate: new Date(dueDate).toISOString(),
      };

      if (editTask) {
        await taskService.updateTask(editTask._id, taskData);
      } else {
        await taskService.createTask(taskData);
      }

      toast({
        title: `Task ${editTask ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
      });
      
      onTaskAdded();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save task. Please try again.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {editTask ? 'Edit Task' : 'Create New Task'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} pb={4}>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Task description"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Due Date</FormLabel>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={loading}
              >
                {editTask ? 'Update Task' : 'Create Task'}
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
