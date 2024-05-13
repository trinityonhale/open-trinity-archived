import { theme } from './theme';
import { router } from './router';
import { ColorSchemeScript, MantineProvider, Container, Group, Box, Text } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './firebase/AuthProvider';
import { ColorSchemeToggle } from './components/ColorSchemeToggle';
import { UserMenu } from './components/UserMenu';

function App() {

  return (
    <>
      <ColorSchemeScript />
      <AuthProvider>
        <MantineProvider theme={theme}>
          <ModalsProvider>
            <Container p="lg">
              <Group justify="space-between">
                <Box>
                  <Text fw="bold" size="sm">Open Trinity</Text>
                  <Text c="dimmed" size='xs'>Task management system</Text>
                </Box>
                <UserMenu />
                <ColorSchemeToggle />
              </Group>
              <RouterProvider router={router} />

              <Group justify="center" mt="xl">
                <Text c="dimmed" size="sm">&copy; {new Date().getFullYear()} Trinity United Church Community Centre</Text>
              </Group>
            </Container>
          </ModalsProvider>
        </MantineProvider>
      </AuthProvider>
    </>
  );
}

export default App;
