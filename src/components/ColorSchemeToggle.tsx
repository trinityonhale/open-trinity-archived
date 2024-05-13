import { ActionIcon, Group, useMantineColorScheme } from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";

export function ColorSchemeToggle() {
  const { toggleColorScheme, colorScheme } = useMantineColorScheme();

  return (
    <ActionIcon onClick={() => toggleColorScheme()} variant="default">
      {colorScheme == "light" && (
        <IconSun style={{ width: "70%", height: "70%" }} stroke={1.5} />
      )}
      {colorScheme == "dark" && (
        <IconMoon style={{ width: "70%", height: "70%" }} stroke={1.5} />
      )}
    </ActionIcon>
  );
}
