import { Card, Avatar, Text, Progress, Badge, Group, AvatarGroup } from '@mantine/core';

import { Link } from 'react-router-dom';
import { Project } from '../firebase/types';

const avatars = [
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png',
];

type Props = {
  project: Project
};

export function ProjectCard({ project }: Props) {
  return (
    <Card withBorder padding="lg" radius="md" component={Link} to={`/projects/${project.id}`}>
      {/* <Group justify="space-between" mb="md">
        <Badge>Live at Trinity</Badge>
      </Group> */}

      <Text fz="xs" c="blue" fw="bold" tt="uppercase">
        {project.onAirAt ? project.onAirAt.toDate().toLocaleString() : 'TBD'}
      </Text>

      <Text fz="lg" fw={500}>
        {project.name}
      </Text>

      <Text fz="sm" c="dimmed" mt={5}>
        {project.description}
      </Text>
{/* 
      <Text c="dimmed" fz="sm" mt="md">
        Tasks completed:{' '}
        <Text span fw={500} c="bright">
          23/36
        </Text>
      </Text>

      <Progress value={(23 / 36) * 100} mt={5} />

      <Group justify="space-between" mt="md">
        <AvatarGroup spacing="sm">
          <Avatar src={avatars[0]} radius="xl" />
          <Avatar src={avatars[1]} radius="xl" />
          <Avatar src={avatars[2]} radius="xl" />
          <Avatar radius="xl">+5</Avatar>
        </AvatarGroup>
      </Group> */}
    </Card>
  );
}