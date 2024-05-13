import { useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";
import { IconArrowBack } from "@tabler/icons-react";

export default function BackButton() {

    const navigate = useNavigate();

    return (
        <Button
            mt="xl"
            leftSection={<IconArrowBack size={14} />}
            size="xs"
            variant="light"
            onClick={() => navigate(-1)}>Back</Button>
    );
}