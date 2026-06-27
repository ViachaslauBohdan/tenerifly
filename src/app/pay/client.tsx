"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Alert,
  Button,
  Checkbox,
  Group,
  NumberInput,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { IconCreditCard, IconShieldCheck } from "@tabler/icons-react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  SiteHeader,
  type SiteHeaderLanguage,
} from "@/components/SiteHeader";
import payJson from "@/i18n/pay.json";
import { pickLocaleBundle } from "@/types/locale";
import type { PaymentCategory } from "@/types/strapi";

type PayBundle = (typeof payJson)["en"];

const CATEGORY_OPTIONS: PaymentCategory[] = ["tour", "car", "apartment"];

export default function PayPageClient() {
  const { locale, switchLocale, createLocaleLink, t } = useTranslation();
  const searchParams = useSearchParams();
  const pay = pickLocaleBundle(payJson as Record<string, PayBundle>, locale);

  const [language, setLanguage] = useState<SiteHeaderLanguage>(
    locale as SiteHeaderLanguage
  );
  const [categories, setCategories] = useState<PaymentCategory[]>([]);
  const [amount, setAmount] = useState<number | string>("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelled = searchParams.get("cancelled") === "1";

  useEffect(() => {
    setLanguage(locale as SiteHeaderLanguage);
  }, [locale]);

  const toggleCategory = (category: PaymentCategory, checked: boolean) => {
    setCategories((current) =>
      checked
        ? [...current, category]
        : current.filter((item) => item !== category)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (categories.length === 0) {
      setError(pay.categoryError);
      return;
    }

    const numericAmount = typeof amount === "number" ? amount : Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount < 0.5) {
      setError(pay.amountError);
      return;
    }

    if (!fullName.trim()) {
      setError(pay.nameError);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(pay.emailError);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categories,
          amount: numericAmount,
          customerName: fullName.trim(),
          customerEmail: email.trim(),
          customerPhone: phone.trim() || undefined,
          customerNote: note.trim() || undefined,
          locale,
        }),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        setError(data.error ?? pay.submitError);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError(pay.submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <SiteHeader
        language={language}
        onLanguageChange={switchLocale}
        selectLanguageLabel={t.selectLanguage}
        excursionsLabel={t.hero.tabs.excursions}
        variant="standalone"
        activePage="pay"
        payByCardLabel={pay.navLabel}
        createLocaleLink={createLocaleLink}
      />

      <div className="pt-[6.25rem] min-[400px]:pt-[6.5rem] sm:pt-[6.25rem] md:pt-16">
        <div className="mx-auto max-w-lg px-4 py-8 min-[400px]:px-5 sm:px-6 sm:py-10">
          <Stack gap="lg">
            <div>
              <Title order={1} className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {pay.title}
              </Title>
              <Text className="mt-2 text-gray-600">{pay.subtitle}</Text>
            </div>

            {cancelled ? (
              <Alert color="yellow" title={pay.cancelledTitle}>
                {pay.cancelledMessage}
              </Alert>
            ) : null}

            {error ? (
              <Alert color="red" onClose={() => setError(null)} withCloseButton>
                {error}
              </Alert>
            ) : null}

            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <div>
                  <Text fw={600} className="mb-2 text-gray-900">
                    {pay.categoriesLabel}
                  </Text>
                  <Stack gap="xs">
                    {CATEGORY_OPTIONS.map((category) => (
                      <Checkbox
                        key={category}
                        label={pay.categories[category]}
                        checked={categories.includes(category)}
                        onChange={(event) =>
                          toggleCategory(category, event.currentTarget.checked)
                        }
                      />
                    ))}
                  </Stack>
                </div>

                <NumberInput
                  label={pay.amountLabel}
                  placeholder={pay.amountPlaceholder}
                  value={amount}
                  onChange={setAmount}
                  min={0.5}
                  decimalScale={2}
                  fixedDecimalScale
                  suffix=" €"
                  required
                />

                <Text fw={600} className="text-gray-900">
                  {pay.contactInfo}
                </Text>

                <TextInput
                  label={pay.fullName}
                  value={fullName}
                  onChange={(event) => setFullName(event.currentTarget.value)}
                  required
                />

                <TextInput
                  label={pay.email}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.currentTarget.value)}
                  required
                />

                <TextInput
                  label={pay.phone}
                  value={phone}
                  onChange={(event) => setPhone(event.currentTarget.value)}
                />

                <Textarea
                  label={pay.note}
                  placeholder={pay.notePlaceholder}
                  value={note}
                  onChange={(event) => setNote(event.currentTarget.value)}
                  minRows={3}
                />

                <Group gap="xs" className="text-sm text-gray-600">
                  <IconShieldCheck size={18} className="shrink-0" />
                  <Text size="sm">{pay.secureNote}</Text>
                </Group>

                <Button
                  type="submit"
                  size="lg"
                  leftSection={<IconCreditCard size={18} />}
                  loading={isSubmitting}
                  loaderProps={{ children: pay.submitting }}
                >
                  {isSubmitting ? pay.submitting : pay.submit}
                </Button>
              </Stack>
            </form>
          </Stack>
        </div>
      </div>
    </main>
  );
}
