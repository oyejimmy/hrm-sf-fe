import React from 'react';
import { Modal, Form, Input, Select, Button, DatePicker } from 'antd';
import { TaskFormValues, User } from '../types';

const { Option } = Select;
const { TextArea } = Input;

interface TaskModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: TaskFormValues) => void;
  form: any;
  mockUsers: User[];
  currentUser: User;
}

const TaskModal: React.FC<TaskModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  form,
  mockUsers,
  currentUser
}) => {
  return (
    <Modal
      title="New Task"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please enter a title' }]}
        >
          <Input placeholder="Enter task title" />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter a description' }]}
        >
          <TextArea rows={3} placeholder="Enter task description..." />
        </Form.Item>
        
        <Form.Item
          name="assignee"
          label="Assignee"
          rules={[{ required: true, message: 'Please select an assignee' }]}
        >
          <Select placeholder="Select assignee">
            {mockUsers
              .filter(user => user.id !== currentUser.id)
              .map(user => (
                <Option key={user.id} value={user.id}>
                  {user.name} ({user.role.toUpperCase()})
                </Option>
              ))
            }
          </Select>
        </Form.Item>
        
        <Form.Item
          name="dueDate"
          label="Due Date"
          rules={[{ required: true, message: 'Please select a due date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        
        <Form.Item
          name="priority"
          label="Priority"
          initialValue="medium"
        >
          <Select>
            <Option value="low">Low</Option>
            <Option value="medium">Medium</Option>
            <Option value="high">High</Option>
          </Select>
        </Form.Item>
        
        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Button style={{ marginRight: 8 }} onClick={onCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Create Task
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskModal;