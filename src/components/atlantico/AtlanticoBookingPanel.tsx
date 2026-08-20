"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PhoneNumberInput,
  isPhoneNumberValid,
  type Country,
} from "@/components/PhoneNumberInput";
import { getAtlanticoUiCopy } from "./atlanticoCopy";
import { sessionsForIsoDate } from "@/lib/atlantico/availability";
import { toAtlanticoLanguage } from "@/lib/atlantico/language";
import { estimateBookingTotal } from "@/lib/atlantico/prices";
import { isValidEmail } from "@/lib/atlantico/parse";
import { gtagReportConversion } from "@/lib/gtag";
import { formatTileAmount } from "@/components/TilePriceBadge";
import type {
  AtlanticoEventDetails,
  AtlanticoLoadLimitsResponse,
  ParsedPrices,
} from "@/lib/atlantico/types";
import type { Locale } from "@/types/locale";
import type { E164Number } from "libphonenumber-js";

type AtlanticoBookingPanelProps = {
  tourCode: string;
  tourName: string;
  events: AtlanticoEventDetails[];
  locale: Locale | string;
};

function GuestStepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="h-8 w-8 rounded-full border border-gray-300 text-lg leading-none text-gray-700 hover:bg-gray-50"
          onClick={() => onChange(Math.max(0, value - 1))}
          aria-label={`${label} -`}
        >
          −
        </button>
        <span className="w-6 text-center text-sm font-medium">{value}</span>
        <button
          type="button"
          className="h-8 w-8 rounded-full border border-gray-300 text-lg leading-none text-gray-700 hover:bg-gray-50"
          onClick={() => onChange(value + 1)}
          aria-label={`${label} +`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export function AtlanticoBookingPanel({
  tourCode,
  tourName,
  events,
  locale,
}: AtlanticoBookingPanelProps) {
  const copy = getAtlanticoUiCopy(locale);
  const [eventCode, setEventCode] = useState(events[0]?.code || events[0]?.id || "");
  const [dates, setDates] = useState<string[]>([]);
  const [limits, setLimits] = useState<AtlanticoLoadLimitsResponse | null>(null);
  const [tourDate, setTourDate] = useState("");
  const [sesTime, setSesTime] = useState("00:00");
  const [adults, setAdults] = useState(2);
  const [childs, setChilds] = useState(0);
  const [infants, setInfants] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountry, setPhoneCountry] = useState<Country | undefined>("ES");
  const [phone, setPhone] = useState<E164Number | undefined>();
  const [notes, setNotes] = useState("");
  const [hotel, setHotel] = useState("");
  const [prices, setPrices] = useState<ParsedPrices | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingCode, setBookingCode] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);

  const selectedEvent = events.find(
    (event) => event.code === eventCode || event.id === eventCode
  );

  const sessions = useMemo(
    () => (tourDate ? sessionsForIsoDate(limits, tourDate) : []),
    [limits, tourDate]
  );

  useEffect(() => {
    if (!eventCode) return;
    let cancelled = false;

    async function loadAvailability() {
      setLoadingAvailability(true);
      setError(null);
      setPrices(null);
      setTourDate("");
      try {
        const res = await fetch(
          `/api/atlantico/availability?code=${encodeURIComponent(eventCode)}&locale=${encodeURIComponent(String(locale))}`
        );
        const data = (await res.json()) as {
          dates?: string[];
          limits?: AtlanticoLoadLimitsResponse;
          error?: string;
        };
        if (!res.ok) {
          throw new Error(data.error || copy.errorGeneric);
        }
        if (!cancelled) {
          const nextDates = data.dates ?? [];
          setDates(nextDates);
          setLimits(data.limits ?? null);
          setTourDate(nextDates[0] ?? "");
        }
      } catch (err) {
        if (!cancelled) {
          setDates([]);
          setLimits(null);
          setError(err instanceof Error ? err.message : copy.errorGeneric);
        }
      } finally {
        if (!cancelled) setLoadingAvailability(false);
      }
    }

    void loadAvailability();
    return () => {
      cancelled = true;
    };
  }, [copy.errorGeneric, eventCode, locale]);

  useEffect(() => {
    if (!eventCode || !tourDate) {
      setPrices(null);
      return;
    }
    let cancelled = false;
    const pProd = selectedEvent?.pProd
      ? `&pProd=${encodeURIComponent(String(selectedEvent.pProd))}`
      : "";

    async function loadPrices() {
      try {
        const res = await fetch(
          `/api/atlantico/prices?code=${encodeURIComponent(eventCode)}&date=${encodeURIComponent(tourDate)}${pProd}`
        );
        const data = (await res.json()) as {
          prices?: ParsedPrices | null;
        };
        if (!cancelled) setPrices(res.ok ? data.prices ?? null : null);
      } catch {
        if (!cancelled) setPrices(null);
      }
    }

    const firstSession = sessionsForIsoDate(limits, tourDate)[0];
    setSesTime(firstSession?.time || "00:00");
    void loadPrices();
    return () => {
      cancelled = true;
    };
  }, [eventCode, limits, selectedEvent?.pProd, tourDate]);

  const total = estimateBookingTotal(prices, adults, childs, infants);
  const phoneValid = isPhoneNumberValid(phoneCountry, phone);
  const guestsOk = adults + childs + infants >= 1;
  const fieldErrors = {
    event: eventCode ? undefined : copy.selectOption,
    date: tourDate ? undefined : copy.selectDate,
    guests: guestsOk ? undefined : copy.atLeastOneGuest,
    name: name.trim() ? undefined : copy.nameError,
    email: isValidEmail(email) ? undefined : copy.emailError,
    phone: phoneValid ? undefined : copy.phoneError,
  };
  const isValid = Object.values(fieldErrors).every((message) => !message);

  const handleSubmit = async () => {
    setAttempted(true);
    if (submitting || !isValid) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/atlantico/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          t_id: eventCode,
          t_group: tourCode,
          language: toAtlanticoLanguage(locale),
          tourDate,
          sesTime: sesTime || "00:00",
          adults,
          childs,
          infants,
          name: name.trim(),
          email: email.trim(),
          phone,
          hotel: hotel.trim() || undefined,
          Notes: notes.trim() || undefined,
        }),
      });
      const data = (await res.json()) as {
        bookingCode?: string;
        error?: string;
      };
      if (!res.ok || !data.bookingCode) {
        throw new Error(data.error || copy.errorGeneric);
      }
      setBookingCode(data.bookingCode);
      gtagReportConversion();
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  };

  if (bookingCode) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-5">
        <h3 className="text-lg font-semibold text-green-800">{copy.successTitle}</h3>
        <p className="mt-2 text-sm text-green-800">{copy.successBody}</p>
        <p className="mt-4 text-sm text-gray-700">
          {tourName}
        </p>
        <p className="mt-2 font-mono text-base font-semibold text-gray-900">
          {copy.bookingCode}: {bookingCode}
        </p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <p className="text-sm text-gray-500">{copy.noAvailability}</p>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit();
      }}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-blue-700">
        {copy.partnerPowered}
      </p>

      {events.length > 1 ? (
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">{copy.option}</span>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={eventCode}
            onChange={(event) => setEventCode(event.target.value)}
            aria-invalid={attempted && Boolean(fieldErrors.event)}
          >
            {events.map((item) => (
              <option key={item.code || item.id} value={item.code || item.id}>
                {item.name}
              </option>
            ))}
          </select>
          {attempted && fieldErrors.event ? (
            <span className="mt-1 block text-sm text-red-600">{fieldErrors.event}</span>
          ) : null}
        </label>
      ) : (
        <p className="text-sm text-gray-600">{selectedEvent?.name}</p>
      )}

      {loadingAvailability ? (
        <p className="text-sm text-gray-500">{copy.loadingAvailability}</p>
      ) : dates.length === 0 ? (
        <p className="text-sm text-gray-500">{copy.noAvailability}</p>
      ) : (
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">{copy.date}</span>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={tourDate}
            onChange={(event) => setTourDate(event.target.value)}
            aria-invalid={attempted && Boolean(fieldErrors.date)}
          >
            {dates.map((iso) => (
              <option key={iso} value={iso}>
                {iso}
              </option>
            ))}
          </select>
          {attempted && fieldErrors.date ? (
            <span className="mt-1 block text-sm text-red-600">{fieldErrors.date}</span>
          ) : null}
        </label>
      )}
      {attempted && !loadingAvailability && dates.length === 0 && fieldErrors.date ? (
        <p className="text-sm text-red-600">{fieldErrors.date}</p>
      ) : null}

      {sessions.length > 0 ? (
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">{copy.session}</span>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={sesTime}
            onChange={(event) => setSesTime(event.target.value)}
          >
            {sessions.map((session) => (
              <option key={`${session.sessionId}-${session.time}`} value={session.time}>
                {session.time}
              </option>
            ))}
          </select>
        </label>
      ) : tourDate ? (
        <p className="text-xs text-gray-500">{copy.noSession}</p>
      ) : null}

      <div className="space-y-2">
        <GuestStepper label={copy.adults} value={adults} onChange={setAdults} />
        <GuestStepper label={copy.children} value={childs} onChange={setChilds} />
        <GuestStepper label={copy.infants} value={infants} onChange={setInfants} />
        {attempted && fieldErrors.guests ? (
          <p className="text-sm text-red-600">{fieldErrors.guests}</p>
        ) : null}
      </div>

      {prices?.kind === "perPerson" ? (
        <p className="text-sm text-gray-600">
          {copy.adults} €{formatTileAmount(prices.adult, locale as Locale)} · {copy.children}{" "}
          €{formatTileAmount(prices.child, locale as Locale)}
        </p>
      ) : null}

      {total != null ? (
        <p className="text-lg font-semibold text-blue-700">
          {copy.total}: €{formatTileAmount(total, locale as Locale)}
        </p>
      ) : null}

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-gray-700">{copy.fullName}</span>
        <input
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          aria-invalid={attempted && Boolean(fieldErrors.name)}
        />
        {attempted && fieldErrors.name ? (
          <span className="mt-1 block text-sm text-red-600">{fieldErrors.name}</span>
        ) : null}
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-gray-700">{copy.email}</span>
        <input
          type="email"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          aria-invalid={attempted && Boolean(fieldErrors.email)}
        />
        {attempted && fieldErrors.email ? (
          <span className="mt-1 block text-sm text-red-600">{fieldErrors.email}</span>
        ) : null}
      </label>

      <PhoneNumberInput
        label={copy.phone}
        country={phoneCountry}
        value={phone}
        onCountryChange={setPhoneCountry}
        onChange={setPhone}
        error={attempted && fieldErrors.phone ? fieldErrors.phone : undefined}
      />

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-gray-700">{copy.hotel}</span>
        <input
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          value={hotel}
          onChange={(event) => setHotel(event.target.value)}
          placeholder={copy.hotelPlaceholder}
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-gray-700">{copy.notes}</span>
        <textarea
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          rows={3}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder={copy.notesPlaceholder}
        />
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {submitting ? copy.processing : copy.bookNow}
      </button>
    </form>
  );
}
