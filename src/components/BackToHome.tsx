import { Button, Group } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';

export function BackToHome() {
  return (
    <Group justify="flex-start" mb="md">
      <Link href="/" passHref>
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          component="a"
        >
          Back to Home
        </Button>
      </Link>
    </Group>
  );
} 