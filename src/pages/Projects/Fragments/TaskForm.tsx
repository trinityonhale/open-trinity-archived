import {
  Button,
  ComboboxData,
  ComboboxItem,
  Group,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Task } from "../../../firebase/types";
import { createTaskForProject } from "../../../firebase/dao";

const sprints = 5;

const sprintOptions: ComboboxData = [...Array(sprints)].map(
  (_, index): ComboboxItem => ({
    value: (index + 1).toString(),
    label: `Sprint ${index + 1}`,
  })
);

export default function TaskForm(props: {
  projectId: string;
  closeHandler: Function;
}) {
  const { projectId, closeHandler } = props;

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      description: "",
      sprint: "1",
      // which team will be the lead on this task
      team: "",
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : "Name is required"),
      description: (value) =>
        value.trim().length > 0 ? null : "Description is required",
    },
  });

  const onSubmit = form.onSubmit(
    (values) => {
      createTaskForProject(
        {
          name: values.name,
          description: values.description,
          sprint: parseInt(values.sprint),
        },
        projectId
      )
        .then((resp) => {
          console.log("Task created", resp);
          closeHandler();
          // close modal
        })
        .catch((err) => {
          console.error("Error creating task", err);
        });
    },
    () => {
      // handle validation error
    }
  );

  return (
    <form onSubmit={onSubmit}>
      <TextInput
        withAsterisk
        label="Name"
        placeholder="Name of the task"
        key={form.key("name")}
        {...form.getInputProps("name")}
      />

      <Select
        withAsterisk
        label="Sprint"
        placeholder="Which sprint this task belongs to"
        data={sprintOptions}
        key={form.key("sprint")}
        {...form.getInputProps("sprint")}
      />

      <Textarea
        label="Description"
        placeholder="Overview of the task"
        key={form.key("description")}
        {...form.getInputProps("description")}
      />

      <Group justify="flex-end" mt="md">
        <Button type="submit">Create</Button>
      </Group>
    </form>
  );
}
