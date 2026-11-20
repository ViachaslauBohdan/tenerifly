/** Town and district centers on Tenerife, keyed without accents. */
export const TENERIFE_PLACES: Record<string, { lat: number; lng: number }> = {
  adeje: { lat: 28.13944, lng: -16.73946 },
  // Listings use this name for the Los Gigantes coast, not the cliff face further north.
  "acantilados de los gigantes": { lat: 28.24564, lng: -16.84014 },
  arico: { lat: 28.19053, lng: -16.49776 },
  arona: { lat: 28.09962, lng: -16.68091 },
  "callao salvaje": { lat: 28.13068, lng: -16.77734 },
  chayofa: { lat: 28.07222, lng: -16.69786 },
  "costa adeje": { lat: 28.08698, lng: -16.7358 },
  "el duque": { lat: 28.09259, lng: -16.73671 },
  "el medano": { lat: 28.04621, lng: -16.53817 },
  "golf del sur": { lat: 28.03741, lng: -16.60949 },
  "guia de isora": { lat: 28.21519, lng: -16.75898 },
  "la jaca": { lat: 28.1218, lng: -16.46245 },
  "la orotava": { lat: 28.38988, lng: -16.52357 },
  "las americas": { lat: 28.0602, lng: -16.73105 },
  "los abrigos": { lat: 28.02916, lng: -16.59077 },
  "los cristianos": { lat: 28.05263, lng: -16.717 },
  "los gigantes": { lat: 28.24564, lng: -16.84014 },
  "los menores": { lat: 28.141, lng: -16.757 },
  "playa de las americas": { lat: 28.0602, lng: -16.73105 },
  "playa de san juan": { lat: 28.18179, lng: -16.81675 },
  "playa del duque": { lat: 28.09066, lng: -16.74126 },
  "playa paraiso": { lat: 28.12202, lng: -16.77315 },
  "puertito de guimar": { lat: 28.29231, lng: -16.37797 },
  "puerto de santiago": { lat: 28.23795, lng: -16.84084 },
  "santiago del teide": { lat: 28.2707, lng: -16.81647 },
};

export function lookupTenerifePlace(key: string) {
  return TENERIFE_PLACES[key] ?? null;
}
