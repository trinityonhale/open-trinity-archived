import { useForm } from '@mantine/form';
import { TextInput, Button, Group, Select, NumberInput, Box } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { Project } from '../../firebase/types';
import { createProject } from '../../firebase/dao';
import { useNavigate } from 'react-router-dom';

export default function CreateProject() {

  const navigate = useNavigate();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      seriesRef: '', // which series this project belongs to, nullable
      onAirAt: undefined, // when will the project be live
      name: '', // project name
      description: '', // project description
      sprints: 1
    },

    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'Name is required'),
      description: (value) => (value.trim().length > 0 ? null : 'Description is required'),
    },
  });

  const submitHandler = form.onSubmit(async (values) => {
      // TODO: seriesRef
      const project: Project = {
        name: values.name,
        description: values.description,
        ...(values.onAirAt ? { onAirAt: values.onAirAt } : {}),
        sprints: values.sprints,
      };

      await createProject(project).then((resp) => {
        console.log('Project created', resp);

        navigate('/');
      }).catch((err) => {
        console.error('Error creating project', err);
      })

    }, () => {
      console.log('Validation error');
    })

  return (
    <Box my="xl">
      <form onSubmit={submitHandler}>
        <TextInput
          withAsterisk
          label="Name"
          placeholder="Name of the project"
          key={form.key('name')}
          {...form.getInputProps('name')}
        />

        <TextInput
          withAsterisk
          label="Description"
          placeholder="A brief description of the project"
          key={form.key('description')}
          {...form.getInputProps('description')}
        />

        <DateTimePicker
          label="On Air At"
          clearable={true}
          placeholder="When will the project be live"
          key={form.key('onAirAt')}
          {...form.getInputProps('onAirAt')}
        />

        <Select
          label="Series"
          placeholder="Which series this project belongs to"
          data={['React', 'Angular', 'Vue', 'Svelte']}
          key={form.key('seriesRef')}
          {...form.getInputProps('seriesRef')}
          clearable
        />

        <NumberInput
          label="Sprints"
          description="How many sprints will this project have"
          key={form.key('sprints')}
          {...form.getInputProps('sprints')}
          min={1}
          max={10}
          defaultValue={1}
          step={1}
        >

        </NumberInput>

        <Group justify="flex-end" mt="md">
          <Button type="submit">Create</Button>
        </Group>
      </form>
    </Box>
  );
}
