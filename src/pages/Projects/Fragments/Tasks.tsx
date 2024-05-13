import {
  Table,
  TableThead,
  TableTr,
  TableTd,
  TableTh,
  TableTbody,
  ProgressRoot,
  ProgressSection,
  Anchor,
  Text,
  Avatar,
  AvatarGroup,
  Group,
  Badge,
  Progress,
} from "@mantine/core";

import { Link } from "react-router-dom";

import { TaskStatus, TaskStatusColors } from "../../../constants";
import { useEffect, useState } from "react";
import { getTasksForProject } from "../../../firebase/dao";
import { Task } from "../../../firebase/types";
import { IconCircleCheck, IconCircleDot } from "@tabler/icons-react";

const avatars = [
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png",
];

const data = [
  {
    id: "2311212",
    status: "NOT_ASSIGNED",
    task: "Make some poster for the event",
    team: "Social Media",
    sprint: "Sprint 1",
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
  },
  {
    id: "231122",
    status: "COMPLETED",
    task: "Choose the music list",
    team: "Choir",
    sprint: "Sprint 1",
    subtasks: [],
  },
  {
    id: "23112",
    status: "DISCARDED",
    task: "Interview the band",
    sprint: "Sprint 2",
    subtasks: [],
  },
  {
    id: "231",
    status: "REVIEWING",
    task: "Promotion video for the event",
    sprint: "Sprint 2",
    subtasks: [
      {
        title: "Collect footage",
        completed: true,
      },
    ],
  },
  {
    id: "123321",
    status: "IN_PROGRESS",
    task: "Create the event on social media",
    sprint: "Sprint 2",
    subtasks: [
      {
        title: "Post on Facebook",
        completed: true,
      },
      {
        title: "Post on Eventbrite",
        completed: false,
      },
      {
        title: "Post on Meetup",
        completed: false,
      },
    ],
  },
  {
    id: "12332",
    status: "IN_PROGRESS",
    task: "Promote the event on social media",
    sprint: "Sprint 2",
    subtasks: [
      {
        title: "Make a post on Facebook",
        completed: true,
      },
      {
        title: "Make a post on Instagram",
        completed: true,
      },
      {
        title: "Make a post on Twitter",
        completed: false,
      },
    ],
  },
  {
    id: "123",
    status: "NOT_ASSIGNED",
    author: "Philip K Dick",
    sprint: "Sprint 3",
    subtasks: [
      {
        title: "",
        completed: false,
      },
    ],
  },
];

export function Tasks(props: { projectId: string }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const { projectId } = props;

  useEffect(() => {
    getTasksForProject(projectId!).then((tasks) => {
      setTasks(tasks);
    });
  }, [projectId]);

  const rows = tasks.map((row: Task) => {
    console.log(row);
    const completedSubTasks = row.completedTaskCount ?? 0; // row.subtasks ?
    // row.subtasks.reduce((acc:number, r:any) => acc + (r.completed ? 1 : 0), 0) : 0

    const assignedSubTasks = row.assignedTaskCount ?? 0;

    const totalSubTasks = row.taskCount ?? 0;

    console.log(completedSubTasks, totalSubTasks);

    const percentage =
      completedSubTasks == 0 ? 0 : (completedSubTasks / totalSubTasks) * 100;

    const assignedPercentage =
      completedSubTasks == 0 ? 0 : (assignedSubTasks / totalSubTasks) * 100;

    return (
      <TableTr key={row.id}>
        {/* <TableTd>
          <Anchor component="button" fz="sm">
            <Badge color={TaskStatusColors[row.status as TaskStatus]}>
              {row.status}
            </Badge>
          </Anchor>
        </TableTd> */}
        <TableTd>{row.sprint}</TableTd>
        <TableTd>
          <Anchor component={Link} fz="sm" to={`/tasks/${row.id}`}>
            {row.name}
          </Anchor>
        </TableTd>
        {/* <TableTd>{row.team}</TableTd>
        <TableTd>
          <AvatarGroup spacing="sm">
            <Avatar src={avatars[0]} radius="xl" />
            <Avatar src={avatars[1]} radius="xl" />
            <Avatar src={avatars[2]} radius="xl" />
            <Avatar radius="xl">+5</Avatar>
          </AvatarGroup>
        </TableTd> */}
        <TableTd>
          {totalSubTasks ? (
            <>
              <Group>
                {percentage > 0 && (
                  <Group gap={3}>
                    <Text c="green">
                      <IconCircleCheck size={12} />
                    </Text>
                    <Text fz="xs" c="green" fw={700}>
                      {completedSubTasks} completed
                    </Text>
                  </Group>
                )}

                {assignedPercentage > 0 && (
                  <Group gap={3}>
                    <Text c="blue">
                      <IconCircleDot size={12} />
                    </Text>
                    <Text fz="xs" c="blue" fw={700}>
                      {assignedSubTasks} in progress
                    </Text>
                  </Group>
                )}
              </Group>
              <ProgressRoot>
                <ProgressSection value={percentage} color="green" />
                <ProgressSection value={assignedPercentage} color="blue" />
              </ProgressRoot>
            </>
          ) : (
            ""
          )}
        </TableTd>
      </TableTr>
    );
  });

  return (
    <Table verticalSpacing="xs">
      <TableThead>
        <TableTr>
          {/* <TableTh>Status</TableTh> */}
          <TableTh>Sprint</TableTh>
          <TableTh>Task</TableTh>
          {/* <TableTh>Team</TableTh> */}
          {/* <TableTh>Participant</TableTh> */}
          <TableTh>Progress</TableTh>
        </TableTr>
      </TableThead>
      <TableTbody>{rows}</TableTbody>
    </Table>
  );
}
