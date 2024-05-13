'use client';

import Projects from './Projects';
import { useContext, useState } from 'react';
import {
  Menu,
  MenuTarget,
  MenuDropdown,
  UnstyledButton,
  Group,
  Avatar,
  Text,
  rem,
  Button,
  Container,
} from '@mantine/core';
import { IconChevronDown, IconLogout, IconPlus } from '@tabler/icons-react';
import { Link } from "react-router-dom";
import { User, AuthContext } from '../../firebase/AuthProvider';

export default function HomePage() {

  const user = useContext<User | null>(AuthContext);

  return (
    <>
      <Group mb="xl" mt="xl">
        <Text flex={1} fs="xl" fw={500}></Text>
        <Group>
          {user?.isAdmin && (
          <Button
            leftSection={<IconPlus size={14} />}
            variant="light"
            color="blue"
            component={Link}
            to="/projects/create"
          >
            Create a new project
          </Button>)}
        </Group>
      </Group>
      <Projects />
    </>
  );
}
