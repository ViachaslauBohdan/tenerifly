import { Group, Button } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';

export function BackToHome() {
  return (
    <Group justify="flex-start" mb="md">
      <Link href="/" style={{ textDecoration: 'none' }}>
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
        >
          Back to Home
        </Button>
      </Link>
    </Group>
  );
} 