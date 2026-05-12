export {};

declare global {
  interface Window {
    osGeo: string;
    osDefaultDeparture: string;
    osDefaultDuration: string;
    osDateFrom: string;
    osDateTo: string;
    osHotelCategory: string;
    osFood: string;
    osTransport: string;
    osTarget: string;
    osContainer: string;
    osTourContainer: string;
    osLang: string;
    osTourTargetBlank: boolean;
    osOrderUrl: string | null;
    osCurrency: string;
    osAutoStart: boolean;
  }
}
