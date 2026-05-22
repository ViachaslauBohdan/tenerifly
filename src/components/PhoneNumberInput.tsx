"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Group, Input, Select, Text, TextInput } from "@mantine/core";
import { IconWorld } from "@tabler/icons-react";
import type { CountryCode, E164Number } from "libphonenumber-js";
import {
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
} from "libphonenumber-js";
import flags from "react-phone-number-input/flags";
import styles from "./PhoneNumberInput.module.css";

export type Country = CountryCode;

type InputStyles = {
  input?: React.CSSProperties;
  label?: React.CSSProperties;
};

export interface PhoneNumberInputProps {
  label: string;
  required?: boolean;
  country: Country | undefined;
  value: E164Number | undefined;
  onCountryChange: (country: Country | undefined) => void;
  onChange: (value: E164Number | undefined) => void;
  error?: string;
  placeholder?: string;
  styles?: InputStyles;
}

function CountryFlag({ country }: { country: Country }) {
  const Flag = flags[country];
  if (!Flag) return null;
  return (
    <Box className={styles.flagWrap}>
      <Flag title={country} />
    </Box>
  );
}

function toE164(country: Country, national: string): E164Number | undefined {
  const digits = national.replace(/\D/g, "");
  if (!digits) return undefined;
  return `+${getCountryCallingCode(country)}${digits}` as E164Number;
}

function nationalFromE164(
  country: Country,
  value: E164Number | undefined
): string {
  if (!value) return "";
  const dial = getCountryCallingCode(country).replace(/\D/g, "");
  const all = value.replace(/\D/g, "");
  if (all.startsWith(dial)) return all.slice(dial.length);
  return all;
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

type CountrySelectMeta = {
  value: Country;
  label: string;
  name: string;
  dial: string;
};

const countrySelectData: CountrySelectMeta[] = getCountries()
  .map((code) => {
    const dial = getCountryCallingCode(code);
    const name = regionNames.of(code) ?? code;
    return {
      value: code,
      label: `${name} (+${dial})`,
      name,
      dial,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const countryMetaByCode = new Map(
  countrySelectData.map((item) => [item.value, item])
);

export function isPhoneNumberValid(
  country: Country | undefined,
  value: E164Number | undefined
): boolean {
  return Boolean(country && value && isValidPhoneNumber(value));
}

export function PhoneNumberInput({
  label,
  required,
  country,
  value,
  onCountryChange,
  onChange,
  error,
  placeholder,
  styles: labelStyles,
}: PhoneNumberInputProps) {
  const [national, setNational] = useState("");

  useEffect(() => {
    if (country && value) {
      setNational(nationalFromE164(country, value));
    } else if (!value) {
      setNational("");
    }
  }, [country, value]);

  const selectedDial = useMemo(
    () => (country ? `+${getCountryCallingCode(country)}` : ""),
    [country]
  );

  const handleCountryChange = (code: string | null) => {
    const next = (code as Country) || undefined;
    onCountryChange(next);
    if (next && national) {
      onChange(toE164(next, national));
    } else {
      onChange(undefined);
    }
  };

  const handleNationalChange = (raw: string) => {
    const cleaned = raw.replace(/[^\d\s-]/g, "");
    setNational(cleaned);
    if (!country) {
      onChange(undefined);
      return;
    }
    onChange(toE164(country, cleaned));
  };

  return (
    <Input.Wrapper
      label={label}
      required={required}
      error={error}
      styles={labelStyles}
    >
      <Group gap="xs" wrap="nowrap" align="flex-start" mt={4}>
        <Select
          className={styles.countrySelect}
          aria-label="Country"
          placeholder="Country"
          data={countrySelectData}
          value={country ?? null}
          onChange={handleCountryChange}
          searchable
          nothingFoundMessage="No country"
          leftSection={
            country ? (
              <CountryFlag country={country} />
            ) : (
              <IconWorld size={18} stroke={1.5} color="#64748b" />
            )
          }
          leftSectionWidth={36}
          w={168}
          comboboxProps={{ withinPortal: true, zIndex: 400 }}
          renderOption={({ option }) => {
            const meta = countryMetaByCode.get(option.value as Country);
            return (
              <Group gap="xs" wrap="nowrap">
                <CountryFlag country={option.value as Country} />
                <Text size="sm" style={{ flex: 1 }}>
                  {meta?.name ?? option.label}
                </Text>
                <Text size="sm" c="dimmed">
                  +{meta?.dial ?? ""}
                </Text>
              </Group>
            );
          }}
          filter={({ options, search }) => {
            const q = search.toLowerCase().trim().replace(/^\+/, "");
            if (!q) return options;
            return options.filter((option) => {
              if (!("value" in option)) return true;
              const meta = countryMetaByCode.get(option.value as Country);
              if (!meta) return false;
              return (
                meta.name.toLowerCase().includes(q) ||
                meta.dial.startsWith(q) ||
                meta.label.toLowerCase().includes(`+${q}`) ||
                meta.value.toLowerCase().includes(q)
              );
            });
          }}
          styles={{
            input: labelStyles?.input,
          }}
        />
        <TextInput
          className={styles.numberInput}
          flex={1}
          type="tel"
          inputMode="tel"
          placeholder={
            country ? placeholder ?? "612 345 678" : "Select country first"
          }
          value={national}
          onChange={(e) => handleNationalChange(e.target.value)}
          disabled={!country}
          leftSection={
            selectedDial ? (
              <Text size="sm" c="dimmed" fw={500}>
                {selectedDial}
              </Text>
            ) : undefined
          }
          leftSectionWidth={selectedDial ? 52 : undefined}
          styles={{
            input: labelStyles?.input,
          }}
        />
      </Group>
    </Input.Wrapper>
  );
}
