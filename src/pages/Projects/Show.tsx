"use client";
import { Button, Container, Group, Text } from "@mantine/core";
import { Tasks } from "./Fragments/Tasks";
import { IconPlus } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import TaskForm from "./Fragments/TaskForm";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { getTasksForProject } from "../../firebase/dao";
import { Task } from "../../firebase/types";
import { AuthContext, User } from "../../firebase/AuthProvider";
import BackButton from "../../components/BackButton";

export default function ShowProject() {
  const { projectId } = useParams();

  const user = useContext<User | null>(AuthContext);

  const openModal = () =>
    modals.open({
      id: "create-task",
      title: "Create a new task",
      children: (
        <TaskForm
          projectId={projectId!}
          closeHandler={() => modals.closeAll()}
        />
      ),
    });



  return (
    <>
      <BackButton />
      <Group mb="xl" mt="xl">
        <Text flex={1} fs="xl" fw={500}></Text>
        <Group>
          {user?.isAdmin && (
          <Button
            leftSection={<IconPlus size={14} />}
            variant="light"
            color="blue"
            onClick={openModal}
          >
            Add a new task
          </Button>
          )}
        </Group>
      </Group>

      <Tasks projectId={projectId!}/>
    </>
  );
}
