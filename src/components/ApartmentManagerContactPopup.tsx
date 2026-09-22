"use client";

import { Modal, Stack } from "@mantine/core";
import { IconBrandTelegram, IconBrandWhatsapp } from "@tabler/icons-react";
import {
  getApartmentBookingCopy,
  getApartmentManagerMessage,
} from "@/lib/apartmentBookingCopy";
import {
  telegramWithTextHref,
  whatsappWithTextHref,
} from "@/lib/siteContact";
import type { Locale } from "@/types/locale";

type ApartmentManagerContactPopupProps = {
  opened: boolean;
  onClose: () => void;
  /** Listing title taken from the current card / detail page. */
  propertyTitle: string;
  locale?: Locale | string;
};

export function ApartmentManagerContactPopup({
  opened,
  onClose,
  propertyTitle,
  locale = "en",
}: ApartmentManagerContactPopupProps) {
  const copy = getApartmentBookingCopy(locale);
  const message = getApartmentManagerMessage(propertyTitle, locale);
  const whatsappHref = whatsappWithTextHref(message);
  const telegramHref = telegramWithTextHref(message);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={copy.chooseChannel}
      centered
      size="sm"
      radius="md"
      data-testid="apartment-manager-contact"
    >
      <Stack gap="sm">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 font-medium text-white transition-colors hover:bg-[#1ebe57]"
          data-testid="apartment-manager-whatsapp"
        >
          <IconBrandWhatsapp className="h-5 w-5 shrink-0" stroke={2} />
          {copy.whatsapp}
        </a>
        <a
          href={telegramHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#229ED9] px-4 py-3 font-medium text-white transition-colors hover:bg-[#1b8fc4]"
          data-testid="apartment-manager-telegram"
        >
          <IconBrandTelegram className="h-5 w-5 shrink-0" stroke={2} />
          {copy.telegram}
        </a>
      </Stack>
    </Modal>
  );
}
