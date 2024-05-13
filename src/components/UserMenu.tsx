import { useContext, useState } from 'react';
import { Menu, MenuTarget, MenuDropdown, UnstyledButton, Group, Avatar, Text, rem, Button, Badge } from '@mantine/core';
import { User, AuthContext, signIn, signOut } from '../firebase/AuthProvider';
import { IconChevronDown, IconLogout } from '@tabler/icons-react';

export const UserMenu = () => {
  const user = useContext<User | null>(AuthContext);
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  return (
    <>
    {user && (<Menu
      width={260}
      position="bottom-end"
      transitionProps={{ transition: 'pop-top-right' }}
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      withinPortal
    >
      <MenuTarget>
        <UnstyledButton>
          <Group gap={7}>
            {user.isAdmin && <Badge>Admin</Badge>}
            {user && <Avatar src={user.photoURL} alt={user.displayName} radius="xl" size={20} />}
            <Text fw={500} size="sm" lh={1} mr={3}>
              {user?.displayName}
            </Text>
            <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
          </Group>
        </UnstyledButton>
      </MenuTarget>
      <MenuDropdown>
        <Menu.Item
          leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
          onClick={signOut}
        >
          Logout
        </Menu.Item>
      </MenuDropdown>
    </Menu>)}

    {!user && (<Button onClick={signIn}>Sign in</Button>)}
    </>
  );
};