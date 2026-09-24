const TEST_API = "https://testapi.atlanticoexcursiones.com";

export type AtlanticoAdminProbe = {
  host: string;
  event: { status: number; name?: string; group?: string; times?: string[] };
  prices: { status: number; body: string };
  confirm: { status: number; body: string };
};

export async function probeAtlanticoTestBooking(
  fetchImpl: typeof fetch = fetch
): Promise<AtlanticoAdminProbe> {
  const eventRes = await fetchImpl(`${TEST_API}/eventDetails/184/ENG`);
  const eventText = await eventRes.text();
  let event: { name?: string; group?: string; times?: string[] } = {};
  try {
    event = JSON.parse(eventText) as typeof event;
  } catch {
    event = {};
  }

  const priceRes = await fetchImpl(`${TEST_API}/loadPrices/184/2026-09-25`);
  const priceBody = await priceRes.text();

  const confirmRes = await fetchImpl(`${TEST_API}/confirm/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      userId: "3726",
      t_id: "184",
      t_group: String(event.group || "12"),
      language: "ENG",
      tourDate: "2026-09-25",
      sesTime: "08:00",
      adults: 1,
      childs: 0,
      infants: 0,
      name: "Tenerifly API test",
      email: "api-test@tenerifejoy.com",
      phone: "34600000000",
      Notes: "Admin probe. Please cancel if a booking was created.",
    }),
  });

  return {
    host: TEST_API,
    event: {
      status: eventRes.status,
      name: event.name,
      group: event.group != null ? String(event.group) : undefined,
      times: event.times,
    },
    prices: { status: priceRes.status, body: priceBody.slice(0, 300) },
    confirm: {
      status: confirmRes.status,
      body: (await confirmRes.text()).slice(0, 500),
    },
  };
}
