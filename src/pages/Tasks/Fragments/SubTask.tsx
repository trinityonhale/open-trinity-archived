import {
  IconCircleCheck,
  IconCircleDashed,
  IconCircleDot,
} from "@tabler/icons-react";
import { SubTaskStatus } from "../../../constants";
import {
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Text,
  Group,
  Avatar,
  Accordion,
  TextInput,
  Textarea,
  Button,
} from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import {
  assignSubTaskToUser,
  createSubTaskForTask,
  getSubTasksForTask,
  markSubTaskAsDone,
  unassignSubTask,
} from "../../../firebase/dao";
import { SubTask, Task } from "../../../firebase/types";
import { AuthContext, User } from "../../../firebase/AuthProvider";

type CreateSubTaskAccordionItemProps = {
  onAdded: () => void;
  taskId: string;
  toggleEditing: () => void;
};

const CreateSubTaskAccordionItem = (props: CreateSubTaskAccordionItemProps) => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      description: "",
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : "Title is required"),
      description: (value) =>
        value.trim().length > 0 ? null : "Description is required",
    },
  });

  const submit = form.onSubmit(
    (values) => {
      console.log("Create subtask", values);

      createSubTaskForTask(
        {
          name: values.name,
          description: values.description,
        },
        props.taskId
      )
        .then((resp) => {
          console.log("Subtask created", resp);
          props.toggleEditing();
          props.onAdded();
        })
        .catch((err) => {
          console.error("Error creating subtask", err);
        });
    },
    () => {
      console.log("Validation error");
    }
  );

  return (
    <AccordionItem value="add_task">
      <AccordionControl disabled chevron={false}>
        <TextInput
          variant="unstyled"
          placeholder="Enter the title of the subtask"
          required
          radius="md"
          onClick={(e) => {
            e.stopPropagation();
          }}
          {...form.getInputProps("name")}
        />
      </AccordionControl>

      <AccordionPanel>
        <Textarea
          label="Description"
          placeholder="Enter the description of the subtask"
          {...form.getInputProps("description")}
          required
        />
        <Group gap="xs" mt="md">
          <Button variant="light" onClick={() => submit()}>
            Save
          </Button>
          <Button variant="transparent" onClick={props.toggleEditing}>
            Cancel
          </Button>
        </Group>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default function SubTasks({ taskId }: { taskId: string }) {
  const avatar =
    "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png";

  const SUBTASKS_DEMO = [
    {
      status: "COMPLETED",
      value: "Post event to Facebook",
      description:
        "Crisp and refreshing fruit. Apples are known for their versatility and nutritional benefits. They come in a variety of flavors and are great for snacking, baking, or adding to salads.",
    },
    {
      status: "ASSIGNED",
      value: "Post event to Eventbrite",
      assignee: {
        // id, name, avatar
        name: "James Smith",
        avatar:
          "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png",
      },
      description:
        "Naturally sweet and potassium-rich fruit. Bananas are a popular choice for their energy-boosting properties and can be enjoyed as a quick snack, added to smoothies, or used in baking.",
    },
    {
      status: "NOT_ASSIGNED",
      value: "Post event to Meetup",
      description:
        "Nutrient-packed green vegetable. Broccoli is packed with vitamins, minerals, and fiber. It has a distinct flavor and can be enjoyed steamed, roasted, or added to stir-fries.",
    },
  ];

  const icon: Record<SubTaskStatus, JSX.Element> = {
    COMPLETED: <IconCircleCheck color="green" />,
    ASSIGNED: <IconCircleDot color="purple" />,
    NOT_ASSIGNED: <IconCircleDashed color="gray" />,
  };

  const user = useContext<User | null>(AuthContext);

  const [subtasks, setSubtasks] = useState<SubTask[]>([]);

  const fetchSubTasks = () => {
    getSubTasksForTask(taskId).then((resp) => {
      setSubtasks(resp);
    });
  };

  useEffect(() => {
    fetchSubTasks();
  }, []);

  const assignToMe = (subtaskId: string) => {
    assignSubTaskToUser(subtaskId, user!.uid).then(() => {
      console.log("Assigned to me");
      fetchSubTasks();
    });
  };

  const unassignFromMe = (subtaskId: string) => {
    unassignSubTask(subtaskId).then(() => {
      console.log("Unassigned from me");
      fetchSubTasks();
    });
  }

  const done = (subtaskId: string) => {
    // mark the subtask as done
    markSubTaskAsDone(subtaskId).then(() => {
        fetchSubTasks();
    })
  }

  const items = subtasks.map((item) => {
    const isAssignedToMe = item?.assigneeId ? item.assigneeId === user?.uid : false;

    return (
      <AccordionItem key={item.id} value={item.id!}>
        <AccordionControl icon={icon[item.status as SubTaskStatus]}>
          {item.name}
        </AccordionControl>
        <AccordionPanel>
          {item.description}

          {/* * artifacts - will implement in next phase *
        <Group align='items-between' mt="sm">
          <Anchor style={{ flex: 1 }} size="sm">1.jpg</Anchor>
          <Group gap={8}>
            <Avatar src={avatar} radius="xl" size="sm" />
            <div>

                <Text size="xs" color="dimmed">
                  James Smith
                </Text>
                <Text fw={500} size="sm">
                  123
                </Text>

            </div>
          </Group>
        </Group> */}

          {(item.status !== "NOT_ASSIGNED" && item.assignee?.photoURL) && (
          <Group gap={0} mt="md">
            <Text size="sm" c="dimmed">
              Assigned to&nbsp;
            </Text>
            <Avatar src={item?.assignee?.photoURL} radius="xl" size="xs" />
            <Text size="sm">
              &nbsp;{item?.assignee?.displayName} at {item?.assignedAt?.toDate().toLocaleString()}
            </Text>
          </Group>
          )}

          <Group mt="md" gap="xs">
            {item.status === "NOT_ASSIGNED" && (
              <Button variant="light" onClick={() => assignToMe(item.id!)}>
                Assign to me
              </Button>
            )}

            {item.status === "ASSIGNED" && isAssignedToMe && (
              <Button variant="light" onClick={() => unassignFromMe(item.id!)}>I'll let others do this task</Button>
            )}

            {((user?.isAdmin || isAssignedToMe) && item.status !== 'COMPLETED') && (
              <Button variant="light" onClick={() => done(item.id!)}>Mark as done</Button>
            )}

            {(user?.isAdmin) && (
             <Button variant="light" color="red" onClick={() => unassignFromMe(item.id!)}>Reset</Button>
            )}
          </Group>
        </AccordionPanel>
      </AccordionItem>
    );
  });

  const [isEditing, setIsEditing] = useState(false);
  const [openedItems, setOpenedItems] = useState<string[]>(["add_task"]);

  const toggleEditing = () => {
    setIsEditing((value) => !value);

    if (!isEditing) {
      // remove the item from the list
      setOpenedItems((value) => {
        return value.filter((item) => item !== "add_task");
      });
    } else {
      // add the item to the list
      setOpenedItems((value) => {
        return ["add_task", ...value];
      });
    }
  };

  return (
    <>
      <Accordion
        multiple
        variant="separated"
        defaultValue={openedItems}
        onChange={setOpenedItems}
      >
        {items}
        {isEditing && (
          <CreateSubTaskAccordionItem
            toggleEditing={toggleEditing}
            onAdded={fetchSubTasks}
            taskId={taskId}
          />
        )}
      </Accordion>
      {(!isEditing && user?.isAdmin) && (
        <Group mt="lg">
          <Button variant="light" onClick={toggleEditing}>
            Add a new subtask
          </Button>
        </Group>
      )}
    </>
  );
}
