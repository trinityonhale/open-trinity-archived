"use client";
import {
  Text,
  Accordion,
  AccordionControl,
  AccordionPanel,
  AccordionItem,
  Group,
  Button,
  Avatar,
  Card,
  Badge,
  AvatarGroup,
  TextInput,
  Textarea,
  Box,
} from "@mantine/core";

import { useNavigate } from 'react-router-dom';

import {
  IconCircleDashed,
  IconCircleCheck,
  IconCircleDot,
} from "@tabler/icons-react";
import { TaskStatus, TaskStatusColors, SubTaskStatus } from "../../constants";
import { useContext, useEffect, useState } from "react";
import SubTasks from "./Fragments/SubTask";
import { Task } from "../../firebase/types";
import { getTask } from "../../firebase/dao";
import { useParams } from "react-router-dom";
import { AuthContext, User } from "../../firebase/AuthProvider";
import BackButton from "../../components/BackButton";

const avatars = [
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png",
];

const data = {
  status: "NOT_ASSIGNED",
  task: "Make some poster for the event",
  description:
    "Crisp and refreshing fruit. Apples are known for their versatility and nutritional benefits. They come in a variety of flavors and are great for snacking, baking, or adding to salads.",
  team: "Social Media",
  year: "Sprint 1",
  subtasks: [
    {
      id: "1k2bdr",
      title: "Poster for the event",
      completed: false,

      // artifacts produced for this subtask
      artifacts: [
        {
          title: "Poster for the event",
          url: "https://www.google.com",
          owner_id: 1,
        },
      ],
    },
  ],
  comments: [
    // TODO
  ],
};

function TaskCard(props: { task: Task | null }) {
  const { task } = props;
  const user = useContext<User | null>(AuthContext);

  return (
    <Card withBorder radius="md">
      <Group>
        <Badge color={TaskStatusColors[task?.status as TaskStatus]}>
          {task?.status}
        </Badge>
        <Badge>Sprint {task?.sprint}</Badge>
      </Group>
      <Text mt="xs" fw={500} fz="md">
        {task?.name}
      </Text>
      <Text mt="md">{task?.description}</Text>
      <Group justify="space-between">
        {/* <AvatarGroup spacing="sm" mt="md">
          <Avatar src={avatars[0]} radius="xl" />
          <Avatar src={avatars[1]} radius="xl" />
          <Avatar src={avatars[2]} radius="xl" />
          <Avatar radius="xl">+5</Avatar>
        </AvatarGroup>

        <Group mt="md" gap="xs">
          <Button>Join this task</Button>
          { user?.isAdmin && <Button>Mark as done</Button> }
        </Group> */}
      </Group>
    </Card>
  );
}

export default function ShowTask() {
  const [task, setTask] = useState<Task | null>(null);

  const { taskId } = useParams();

  useEffect(() => {
    getTask(taskId!).then((task) => {
      setTask(task);
    });
  }, []);

  return (
    <>
      <BackButton />
      {taskId && (
        <Box mt="lg">
          <TaskCard task={task} />
          <Text mt="xl" fz="lg" mb="md" fw="bold">
            Sub Tasks
          </Text>
          <SubTasks taskId={taskId} />
          {/* <Text mt="lg" fz="sm" mb="md" fw="bold">
        Comments
      </Text> */}
        </Box>
      )}
      {!taskId && <Text>Task not found</Text>}
    </>
  );
}
