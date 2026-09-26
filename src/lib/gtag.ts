import { readCookieConsent } from "@/lib/cookieConsent";

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void
    }
}

export const GOOGLE_ADS_ID = "AW-679583815";

export const gtagReportConversion = (url?: string) => {
    if (readCookieConsent(window.localStorage) !== "accepted") {
        return;
    }

    console.log("test conve");
    const callback = () => {
        if (url) {
            window.location.href = url
        }
    }

    window.gtag?.('event', 'conversion', {
        send_to: 'AW-679583815/QsSACOPai8wBEMfAhsQC',
        event_callback: callback,
    })
}